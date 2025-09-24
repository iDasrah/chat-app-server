import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: {
    origin: "*"
  },})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private users = new Map<string, string>();

  handleConnection(client: Socket) {
    const username = client.handshake.query.username as string;
    console.log('Client connected:', client.id, 'Username:', username);

    if (username) {
      this.users.set(client.id, username);

      this.server.emit('user-joined', {
        message: `${username} a rejoint la discussion.`,
      });
    }
  }

  handleDisconnect(client: Socket) {
    const username = this.users.get(client.id);
    console.log('Client disconnected:', client.id, 'Username:', username);

    if (username) {
      this.users.delete(client.id);

      this.server.emit('user-left', {
        message: `${username} a quitté la discussion.`,
      });
    }
  }

  @SubscribeMessage('send-message')
  handleMessage(client: Socket, data: { message: string }) {
    const username = this.users.get(client.id);
    console.log('Message from', username, ':', data.message);

    if (username && data.message.trim() !== '') {
      this.server.emit('new-message', {
        username,
        message: data.message.trim(),
        timestamp: new Date(),
      });
    }
  }
}
