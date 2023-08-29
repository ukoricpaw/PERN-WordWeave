import { Server, Socket } from 'socket.io';
import { UserSessionParams } from '../../types/userTypes.js';
import Emitter from '../emitEvents.ts/Emitter.js';
import { UserInstance } from '../../models/User.js';
import { checkUserIfIsNullEmitErrorEvent } from '../../utils/checkUserIfIsNullEmitErrorEvent.js';
import chatRepository from '../../repositories/chatRepository.js';
import userRepository from '../../repositories/userRepository.js';

export function onChatEventsHandlers(
  io: Server,
  socket: Socket,
  userSessionParams: UserSessionParams,
  emitter: Emitter,
) {
  let roomId: number | null = null;

  async function joinDialogChat(email: string) {
    const userContact = await userRepository.findUserByEmail(email);
    checkUserIfIsNullEmitErrorEvent(userContact, socket);
    const roomState = await chatRepository.getRoomAndRoomIdBySearchingRoom({
      user1Id: userSessionParams.userId,
      user2Id: (userContact as UserInstance).id,
    });
    socket.join(String(roomState.roomId));
    roomId = roomState.roomId;

    const messages = await chatRepository.findMessages({ roomId: roomState.roomId, limit: 20, page: 1 });
    emitter.emitEvent('joinToChatOnClientSide')(
      socket.id,
      userSessionParams.userId,
      {
        room: roomState.room,
        messages,
        user: userContact,
      },
      true,
    );
  }

  async function leaveDialogChat() {
    if (!roomId) {
      return;
    }
    socket.leave(String(roomId));
    const count = await chatRepository.countOfRoomMessages(roomId);
    if (!count) {
      const room = io.sockets.adapter.rooms.get(String(roomId));
      if (room) {
        if (room.size === 0) {
          chatRepository.findRoomById(roomId).then(room => room?.destroy());
        }
      }
    }
  }

  return [
    {
      eventName: 'chat:joinDialogChat',
      eventHandler: joinDialogChat,
    },
    {
      eventName: 'chat:leaveDialogChat',
      eventHandler: leaveDialogChat,
    },
  ];
}
