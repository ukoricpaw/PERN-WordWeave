import { Socket } from 'socket.io';
import { UserInstance } from '../models/User.js';

export const checkUserIfIsNullEmitErrorEvent = (user: UserInstance | null, socket: Socket) => {
  if (!user) {
    socket.emit('chat:wrongContact');
    throw Error('Пользователь не найден');
  }
};
