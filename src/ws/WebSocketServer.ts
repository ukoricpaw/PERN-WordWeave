import { Server, Socket } from 'socket.io';
import { Server as HttpServer, IncomingHttpHeaders } from 'http';
import { onEventsHandlers } from './onEvents.ts/index.js';
import tokenService from '../services/tokenService.js';
import Emitter from './emitEvents.ts/Emitter.js';

interface OnlineUsers {
  [Key: string]: string;
}

class WebSocketServer {
  private _io: Server;
  private users: OnlineUsers = {};

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

  disconnectEvent(socket: Socket, userId: number) {
    socket.on('disconnect', () => {
      delete this.users[userId];
      console.log(socket.id, 'left the chat');
    });
  }

  subscribeToEvents(io: Server, socket: Socket) {
    const userSessionParams = this.getUserSessionParams(socket);
    this.disconnectEvent(socket, userSessionParams.userId);
    const emitter = new Emitter(io, socket);
    this.users[userSessionParams.userId] = socket.id;
    onEventsHandlers(io, socket, userSessionParams, emitter);
  }

  getUserSessionParams(socket: Socket) {
    return {
      userId: Number(socket.handshake.query.userId),
    };
  }

  connection() {
    this._io.on('connection', socket => {
      console.log(this.users);
      this.subscribeToEvents(this._io, socket);
    });
  }
}

export default WebSocketServer;
