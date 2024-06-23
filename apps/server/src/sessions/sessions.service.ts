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
    if (createSessionDto.gateways && createSessionDto.gateways.length) {
      // check the gateway has a session of presences
      const gatewaysHasSession = await this.prismaService.client.gateways.findMany({
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

      const isHaveGateway = gatewaysHasSession.every(gateway => gateway.presence_sessionsId === null)
      if (!isHaveGateway) {
        throw new NotFoundException()
      } else {
        const session = await this.prismaService.client.presence_sessions.create({
          data: {
            name: createSessionDto.name,
          },
        })
        return await this.prismaService.client.gateways.updateMany({
          data: {
            presence_sessionsId: session.id
          },
          where: {
            id: {
              in: createSessionDto.gateways
            }
          }
        })
      }

    } else {
      const session = await this.prismaService.client.presence_sessions.create({
        data: {
          name: createSessionDto.name,
        },
      })
      return session
    }

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
          select: {
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
    return await this.prismaService.client.presence_sessions.findUniqueOrThrow({
      where: {
        id
      }
    })
  }

  /**
   * TODO:
   * Belum fix di bagian update
   * jika gateway di pakai maka gateway  tidak bisa
   */
  async update(id: number, updateSessionDto: UpdateSessionDto) {

    const currentSession = await this.prismaService.client.presence_sessions.findUniqueOrThrow({
      where: {
        id
      },
      include: {
        gateways: true
      }
    })
    if (updateSessionDto.gateways && updateSessionDto.gateways.length) {
      // check the gateway has a session of presences
      const gatewaysHasSession = await this.prismaService.client.gateways.findMany({
        where: {
          id: {
            in: updateSessionDto.gateways
          },
          role: 'presence',
          presence_sessionsId: null
        },
        include: {
          presence_sessions: true
        }
      })

      const isHaveGateway = gatewaysHasSession.every(gateway => gateway.presence_sessionsId === null)
      if (!isHaveGateway) {
        throw new NotFoundException()
      } else {
        await this.prismaService.client.gateways.updateMany({
          data: {
            presence_sessionsId: null
          },
          where: {
            id: {
              in: currentSession.gateways.map(gateway => gateway.id)
            },
          }
        })
        const session = await this.prismaService.client.presence_sessions.update({
          where: {
            id
          },
          data: {
            name: updateSessionDto.name,
          },
        })
        await this.prismaService.client.gateways.updateMany({
          data: {
            presence_sessionsId: session.id
          },
          where: {
            id: {
              in: updateSessionDto.gateways
            }
          }
        })
        return session
      }
    } else {
      const session = await this.prismaService.client.presence_sessions.update({
        where: {
          id
        },
        data: {
          name: updateSessionDto.name,
        },
      })

      await this.prismaService.client.gateways.updateMany({
        data: {
          presence_sessionsId: null
        },
        where: {
          id: {
            in: currentSession.gateways.map(gateway => gateway.id)
          },
        }
      })
      return session
    }
  }

  async remove(id: number) {
    return await this.prismaService.client.presence_sessions.delete({
      where: {
        id
      }
    });
  }
}
