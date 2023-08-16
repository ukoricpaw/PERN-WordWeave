import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

class WebSocketServer {
  public io: Server;

  constructor(server: HttpServer) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_URL as string,
        credentials: true,
      },
    });
  }
}
