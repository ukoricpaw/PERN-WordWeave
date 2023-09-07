import { Server, Socket } from 'socket.io';
import { UserSessionParams } from '../../types/userTypes.js';
import { catchErrorWrapper } from '../catchErrorWrapper.js';
import Emitter from '../emitEvents.ts/Emitter.js';
import { onChatEventsHandlers } from './onChatEvents.js';
import { onMessageEventsHandlers } from './onMessageEvents.js';
import { OnlineUsers } from '../WebSocketServer.js';

export function getAllOnEventsHandlers(
  io: Server,
  socket: Socket,
  userSessionParams: UserSessionParams,
  emitter: Emitter,
  onlineUsers: OnlineUsers,
) {
  const handlers = [
    ...onMessageEventsHandlers(socket, userSessionParams, emitter, onlineUsers),
    ...onChatEventsHandlers(io, socket, userSessionParams, emitter),
  ];

  return handlers.map(handler => ({
    eventName: handler.eventName,
    eventHandler: catchErrorWrapper(emitter.emitError)(handler.eventHandler as (...args: any) => Promise<void>),
  }));
}
