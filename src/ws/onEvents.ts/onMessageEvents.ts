import { Socket } from 'socket.io';
import { UserSessionParams } from '../../types/userTypes.js';
import Emitter from '../emitEvents.ts/Emitter.js';
import messageRepository from '../../repositories/messageRepository.js';
import { OnlineUsers } from '../WebSocketServer.js';
import chatRepository from '../../repositories/chatRepository.js';
import { RoomWithLastMessage } from '../../types/roomTypes.js';
import userRepository from '../../repositories/userRepository.js';
import { MessageInstance } from '../../models/Message.js';
import { UserInstance } from '../../models/User.js';

export function onMessageEventsHandlers(
  socket: Socket,
  userSessionParams: UserSessionParams,
  emitter: Emitter,
  onlineUsers: OnlineUsers,
) {
  async function getSentMessage({ message, roomId }: { message: string; roomId: number }) {
    const newMessage = await messageRepository.createMessage(userSessionParams.userId, roomId, message);
    emitter.emitEvent('provideMessage')(String(roomId), userSessionParams.userId, newMessage, true);
    await provideMessageToRoom(roomId, userSessionParams.userId, newMessage);
  }

  async function provideMessageToRoom(roomId: number, userId: number, message: MessageInstance) {
    const room = await chatRepository.findRoomById(roomId);
    if (room) {
      if (room.isGroup) {
      } else {
        let roomResponseForReceiver: RoomWithLastMessage | null,
          roomResponseForSender: RoomWithLastMessage | null = null;
        const userReceiverId = room.user1Id == userId ? room.user2Id : room.user1Id;
        const [userReceiverInfo, userSenderInfo] = await Promise.all([
          userRepository.findUserById(userReceiverId),
          userRepository.findUserById(userId),
        ]);
        roomResponseForSender = {
          room,
          lastMessage: { ...message.dataValues, user: { id: userId } as UserInstance },
          user: userReceiverInfo,
        };
        if (onlineUsers[String(userReceiverId)]) {
          roomResponseForReceiver = {
            room,
            lastMessage: { ...message.dataValues, user: { id: userId } as UserInstance },
            user: userSenderInfo,
          };
          emitter.emitEvent('provideMessageToRoom')(
            onlineUsers[String(userReceiverId)],
            userId,
            roomResponseForReceiver,
            true,
          );
        }
        emitter.emitEvent('provideMessageToRoom')(onlineUsers[String(userId)], userId, roomResponseForSender, true);
      }
    }
  }

  return [
    {
      eventName: 'message:sendToRoom',
      eventHandler: getSentMessage,
    },
  ];
}
