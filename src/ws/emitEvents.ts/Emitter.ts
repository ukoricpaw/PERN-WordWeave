import { Server, Socket } from 'socket.io';
import { EmittersEvents, emitEvents } from './allEmitEvents.js';
import { MessageType } from '../../types/requestTypes.js';

class Emitter {
  public socket: Socket;
  public io: Server;

  constructor(io: Server, socket: Socket) {
    this.io = io;
    this.socket = socket;
  }

  emitError(err: MessageType) {
    this.socket.emit('error:emitErrorMessage', err.message ?? 'Произошла ошибка');
  }

  emitEvent(event: keyof EmittersEvents) {
    return (roomId: string, userId: number, body: any, socketRender: boolean) => {
      try {
        const emitEvent = emitEvents()[event];
        if (socketRender) {
          this.io.in(roomId).emit(emitEvent, { userId, data: body });
        } else {
          this.socket.to(roomId).emit(emitEvent, { userId, data: body });
        }
      } catch (err) {
        this.emitError(err as MessageType);
      }
    };
  }
}

export default Emitter;
