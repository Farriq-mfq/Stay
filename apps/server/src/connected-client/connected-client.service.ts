import { Inject, Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import { EventsGateway } from 'src/events/events.gateway';
import { ExtendedPrismaClient } from 'src/prisma.extension';

@Injectable()
export class ConnectedClientService {
  constructor(
    private readonly eventGateway: EventsGateway,
    @Inject('PrismaService') private prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) { }

  async findAll() {
    return await this.prismaService.client.connected_clients.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async setSession(socketId: string, sessionId: number) {
    const session = await this.prismaService.client.presence_sessions.findUniqueOrThrow({
      where: {
        id: +sessionId
      }
    })
    await this.eventGateway.handleSetSession(socketId, session)
    return session;
  }

}
