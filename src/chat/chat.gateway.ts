import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';


@WebSocketGateway(3080)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
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

  handleDisconnect(client: Socket) {
    const username = this.users.get(client.id);

    if (username) {
      this.users.delete(client.id);

      this.server.emit('user-left', {
        message: `${username} a quitté la discussion.`,
      });
    }
  }

  @SubscribeMessage('send-message')
  handleMessage(client: Socket, message: string) {
    const username = this.users.get(client.id);

    if (username && message.trim() !== '') {
      this.server.emit('new-message', {
        username,
        message: message.trim(),
        timestamp: new Date(),
      });
    }
  }
}
