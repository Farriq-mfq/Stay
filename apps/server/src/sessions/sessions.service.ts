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
      const session = await this.prismaService.client.presence_sessions.create({
        data: {
          name: createSessionDto.name,
          ...createSessionDto.allow_twice && {
            allow_twice: createSessionDto.allow_twice
          },
          ...createSessionDto.start_time && {
            start_time: createSessionDto.start_time
          },
          ...createSessionDto.end_time && {
            end_time: createSessionDto.end_time
          },
          ...createSessionDto.rombel.length > 0 && {
            rombel: JSON.stringify(createSessionDto.rombel)
          }
        },
      })
      await this.prismaService.client.gateways.updateMany({
        data: {
          presence_sessionsId: session.id
        },
        where: {
          id: {
            in: createSessionDto.gateways
          }
        }
      })
      return session
    } else {
      const session = await this.prismaService.client.presence_sessions.create({
        data: {
          name: createSessionDto.name,
          ...createSessionDto.allow_twice && {
            allow_twice: createSessionDto.allow_twice
          },
          ...createSessionDto.start_time && {
            start_time: createSessionDto.start_time
          },
          ...createSessionDto.end_time && {
            end_time: createSessionDto.end_time
          },
          ...createSessionDto.rombel.length > 0 && {
            rombel: JSON.stringify(createSessionDto.rombel)
          }
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
            token: true
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

  async update(id: number, updateSessionDto: UpdateSessionDto) {
    const findSession = await this.prismaService.client.presence_sessions.findUniqueOrThrow({
      where: {
        id
      },
      include: {
        gateways: true
      }
    })
    await this.prismaService.client.gateways.updateMany({
      data: {
        presence_sessionsId: null
      },
      where: {
        id: {
          in: findSession.gateways.map(gateway => gateway.id)
        }
      }
    })
    if (updateSessionDto.gateways && updateSessionDto.gateways.length) {
      const session = await this.prismaService.client.presence_sessions.update({
        where: {
          id
        },
        data: {
          name: updateSessionDto.name,
          allow_twice: updateSessionDto.allow_twice,
          start_time: updateSessionDto.start_time,
          end_time: updateSessionDto.end_time,
          rombel: JSON.stringify(updateSessionDto.rombel)
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
    } else {
      const session = await this.prismaService.client.presence_sessions.update({
        where: {
          id
        },
        data: {
          name: updateSessionDto.name,
          allow_twice: updateSessionDto.allow_twice,
          start_time: updateSessionDto.start_time,
          end_time: updateSessionDto.end_time,
          rombel: JSON.stringify(updateSessionDto.rombel)
        },
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
