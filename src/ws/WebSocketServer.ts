import { Server, Socket } from 'socket.io';
import { Server as HttpServer, IncomingHttpHeaders } from 'http';
import { onEventsHandlers } from './onEvents.ts/index.js';
import tokenService from '../services/tokenService.js';
import Emitter from './emitEvents.ts/Emitter.js';

class WebSocketServer {
  private _io: Server;

  constructor(server: HttpServer) {
    this._io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_URL as string,
        credentials: true,
      },
    });
  }

  checkAccessConnection(socket: Socket, cookies: IncomingHttpHeaders['cookie']) {
    const accessToken = cookies?.split(/accessToken=(.*)\;/g)[1];
    if (!accessToken) {
      socket.disconnect();
    }
    const resultOfValidationAccessToken = tokenService.validateAccessToken(accessToken as string);
    if (!resultOfValidationAccessToken) {
      socket.disconnect();
    }
  }

  disconnectEvent(socket: Socket) {
    socket.on('disconnect', () => {
      console.log(socket.id, 'left the chat');
    });
  }

  subscribeToEvents(io: Server, socket: Socket) {
    this.disconnectEvent(socket);
    const userSessionParams = this.getUserSessionParams(socket);
    const emitter = new Emitter(io, socket);
    socket.join('1');
    console.log(socket.id, 'подключен');
    onEventsHandlers(socket, userSessionParams, emitter);
  }

  getUserSessionParams(socket: Socket) {
    return {
      userId: Number(socket.handshake.query.userId),
    };
  }

  connection() {
    this._io.on('connection', socket => {
      // this.checkAccessConnection(socket, socket.handshake.headers.cookie);
      this.subscribeToEvents(this._io, socket);
    });
  }
}

export default WebSocketServer;
