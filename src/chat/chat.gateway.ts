import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
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
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  private users = new Map<string, string>();

  handleConnection(client: Socket) {
    const username = client.handshake.query.username as string;

    if (username) {
      this.users.set(client.id, username);

      this.server.emit('user-joined', {
        message: `${username} a rejoint la discussion.`,
      });
    }
  }

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
