import { Logger } from '@nestjs/common';
import {
  OnGatewayInit,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';

@WebSocketGateway({ namespace: '/main', cors: true })
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(AppGateway.name);
  constructor() {}

  @WebSocketServer() io: Namespace;

  afterInit(): void {
    this.logger.log('Initialized!');
  }

  handleConnection(client: Socket) {
    const sockets = this.io.sockets;

    this.logger.log(`Client Connected: ${client.id}`);
    this.logger.debug(`Total clients: ${sockets.size}`);
    this.io.emit('users', `Hello ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    const sockets = this.io.sockets;
    this.logger.log(`Client Disconnected: ${client.id}`);
    this.logger.debug(`Total clients: ${sockets.size}`);
  }

  leaveRoom(client: Socket) {
    console.log(client.id);
    Object.keys(client.rooms).forEach((room) => {
      console.log(room);
      if (room !== client.id) {
        client.leave(room);
      }
    });
  }
}
