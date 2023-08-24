import { Socket } from 'socket.io';
import { UserSessionParams } from '../../types/userTypes.js';
import { onMessageEventsHandlers } from './onMessageEvents.js';
import { catchErrorWrapper } from '../catchErrorWrapper.js';
import Emitter from '../emitEvents.ts/Emitter.js';

export function getAllOnEventsHandlers(socket: Socket, userSessionParams: UserSessionParams, emitter: Emitter) {
  const handlers = [...onMessageEventsHandlers(userSessionParams, emitter)];

  return handlers.map(handler => ({
    eventName: handler.eventName,
    eventHandler: catchErrorWrapper(emitter.emitError)(handler.eventHandler),
  }));
}
