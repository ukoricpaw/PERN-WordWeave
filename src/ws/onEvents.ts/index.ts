import { Server, Socket } from 'socket.io';
import { UserSessionParams } from '../../types/userTypes.js';
import { getAllOnEventsHandlers } from './allOnEventsHandlers.js';
import Emitter from '../emitEvents.ts/Emitter.js';

export const onEventsHandlers = (
  io: Server,
  socket: Socket,
  userSessionParams: UserSessionParams,
  emitter: Emitter,
) => {
  const onEventsHandlers = getAllOnEventsHandlers(io, socket, userSessionParams, emitter);
  onEventsHandlers.forEach(eventHandler => {
    socket.on(eventHandler.eventName, eventHandler.eventHandler);
  });
};
