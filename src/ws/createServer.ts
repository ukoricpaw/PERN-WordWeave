import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

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

  connection() {
    this._io.on('connection', socket => {
      const cookies = socket.handshake.headers.cookie;
      console.log(cookies);
      socket.on('disconnect', () => {
        console.log(socket.id, 'был вырублен');
      });
    });
  }
}

export default WebSocketServer;
