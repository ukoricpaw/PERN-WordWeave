import { UserSessionParams } from '../../types/userTypes.js';
import Emitter from '../emitEvents.ts/Emitter.js';

export function onMessageEventsHandlers(userSessionParams: UserSessionParams, emitter: Emitter) {
  async function getSentMessage({ message, roomId }: { message: string; roomId: number }) {
    emitter.emitEvent('provideMessage')(roomId, { message }, false);
  }

  return [
    {
      eventName: 'message:sendToRoom',
      eventHandler: getSentMessage,
    },
  ];
}
