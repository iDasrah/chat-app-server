import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

type Message = {
  message: string;
  username: string;
  timestamp: string;
};

@WebSocketGateway(3080)
export class ChatGateway {
  @WebSocketServer() server: Server;

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() message: Message,
    @ConnectedSocket() client: Socket,
  ) {
    this.server.sockets.sockets.forEach((socket) => {
      if (socket.id !== client.id) {
        socket.emit('message', message);
      }
    });
  }
}
