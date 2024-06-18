import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from 'src/prisma.extension';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

@Injectable()
export class SessionsService {
  constructor(
    @Inject('PrismaService') private prismaService: CustomPrismaService<ExtendedPrismaClient>,

  ) {

  }

  async create(createSessionDto: CreateSessionDto) {
    const session = await this.prismaService.client.presence_sessions.create({
      data: {
        name: createSessionDto.name,
        ...createSessionDto.status && {
          status: createSessionDto.status,
        }
      },
    })

    const unplugGateway = await this.prismaService.client.gateways.findMany({
      where: {
        id: {
          in: createSessionDto.gateways
        },
        role: 'presence'
      },
      include: {
        presence_sessions: true
      }
    })


    if (createSessionDto.gateways && createSessionDto.gateways.length) {
      for (const gateway of unplugGateway) {
        if (gateway.presence_sessions) {
          throw new NotFoundException()
        } else {
          await this.prismaService.client.gateways.updateMany({
            where: {
              id: {
                in: createSessionDto.gateways
              }
            },
            data: {
              presence_sessionsId: session.id
            }
          })
        }
      }
    }

    return session
  }

  async findAll(
    page?: number,
    limit?: number,
    search?: string,
  ) {
    const [items, meta] = await this.prismaService.client.presence_sessions.paginate({
      where: {
        ...search && {
          OR: [
            {
              name: {
                contains: search,
                mode: 'insensitive'
              },
            }
          ]
        }
      },
      include: {
        gateways: {
          select:{
            id: true,
            name: true,
            ip: true,
            location: true,
            role: true,
            status: true,
          }
        }
      }
    }).withPages({
      limit: limit ?? 10,
      includePageCount: true,
      page: page ?? 1
    })

    return {
      items,
      meta
    }
  }

  async findOne(id: number) {
    return await this.prismaService.client.presence_sessions.findUnique({
      where: {
        id
      }
    })
  }

  async update(id: number, updateSessionDto: UpdateSessionDto) {
    const session = await this.prismaService.client.presence_sessions.update({
      where: {
        id,
      },
      data: {
        name: updateSessionDto.name,
        ...updateSessionDto.status && {
          status: updateSessionDto.status,
        }
      },
    })

    const unplugGateway = await this.prismaService.client.gateways.findMany({
      where: {
        id: {
          in: updateSessionDto.gateways
        },
        role: 'presence'
      },
      include: {
        presence_sessions: true
      }
    })


    if (updateSessionDto.gateways && updateSessionDto.gateways.length) {
      for (const gateway of unplugGateway) {
        if (gateway.presence_sessions) {
          throw new NotFoundException()
        } else {
          await this.prismaService.client.gateways.updateMany({
            where: {
              id: {
                in: updateSessionDto.gateways
              }
            },
            data: {
              presence_sessionsId: session.id
            }
          })
        }
      }
    }
    return session;
  }

  async remove(id: number) {
    return await this.prismaService.client.presence_sessions.delete({
      where: {
        id
      }
    });
  }
}
