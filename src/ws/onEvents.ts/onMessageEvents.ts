import { Socket } from 'socket.io';
import { UserSessionParams } from '../../types/userTypes.js';
import Emitter from '../emitEvents.ts/Emitter.js';
import messageRepository from '../../repositories/messageRepository.js';

export function onMessageEventsHandlers(socket: Socket, userSessionParams: UserSessionParams, emitter: Emitter) {
  async function getSentMessage({ message, roomId }: { message: string; roomId: number }) {
    const newMessage = await messageRepository.createMessage(userSessionParams.userId, roomId, message);
    emitter.emitEvent('provideMessage')(String(roomId), userSessionParams.userId, newMessage, true);
  }

  return [
    {
      eventName: 'message:sendToRoom',
      eventHandler: getSentMessage,
    },
  ];
}
