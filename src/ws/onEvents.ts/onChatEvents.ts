import { Server, Socket } from 'socket.io';
import { UserSessionParams, UserType } from '../../types/userTypes.js';
import Emitter from '../emitEvents.ts/Emitter.js';
import { UserInstance } from '../../models/User.js';
import { checkUserIfIsNullEmitErrorEvent } from '../../utils/checkUserIfIsNullEmitErrorEvent.js';
import chatRepository from '../../repositories/chatRepository.js';
import userRepository from '../../repositories/userRepository.js';
import { MessageInstance } from '../../models/Message.js';

export function onChatEventsHandlers(
  io: Server,
  socket: Socket,
  userSessionParams: UserSessionParams,
  emitter: Emitter,
) {
  async function joinDialogChat(email: string) {
    let messages: { count: number; rows: MessageInstance[] } | null = null;
    const userContact = await userRepository.findUserByEmail(email);
    checkUserIfIsNullEmitErrorEvent(userContact, socket);
    const roomState = await chatRepository.getRoomAndRoomIdBySearchingRoom({
      user1Id: userSessionParams.userId,
      user2Id: (userContact as UserInstance).id,
    });
    if (!roomState.isNew) {
      messages = await chatRepository.findMessages({ roomId: roomState.roomId, limit: 8, page: 1 });
    } // } else {
    socket.join(String(roomState.roomId));
    // }
    emitter.emitEvent('joinToChatOnClientSide')(
      socket.id,
      userSessionParams.userId,
      {
        room: roomState.isNew ? roomState.room : null,
        messages: roomState.isNew ? null : messages,
        user: roomState.isNew ? userContact : null,
      },
      true,
    );
  }

  async function clearDialogChat(roomId: number) {
    // console.log(roomId + 'hello');
    const count = await chatRepository.countOfRoomMessages(roomId);
    if (!count) {
      // const roomSockets = await io.in(String(roomId)).fetchSockets();
      // console.log(roomSockets.length);
      // if (!roomSockets.length) {
      io.sockets.adapter.rooms.delete(String(roomId));
      chatRepository.findRoomById(roomId).then(room => {
        room?.destroy();
      });
      // }
    }
  }

  function userIsTypingMessage({ roomId, userData }: { roomId: number; userData: UserType }) {
    emitter.emitEvent('userIsTypingMessageToTheFullRoom')(String(roomId), userData.id, { roomId, userData }, false);
  }

  function userStoppingToTypeMessage({ roomId, userData }: { roomId: number; userData: UserType }) {
    emitter.emitEvent('userIsStoppingToTypeMessageToTheFullRoom')(
      String(roomId),
      userData.id,
      { roomId, userData },
      false,
    );
  }

  return [
    {
      eventName: 'chat:joinDialogChat',
      eventHandler: joinDialogChat,
    },
    {
      eventName: 'chat:clearDialogChat',
      eventHandler: clearDialogChat,
    },
    {
      eventName: 'chat:userTypingMessage',
      eventHandler: userIsTypingMessage,
    },
    {
      eventName: 'chat:userStoppingToTypeMessage',
      eventHandler: userStoppingToTypeMessage,
    },
  ];
}
