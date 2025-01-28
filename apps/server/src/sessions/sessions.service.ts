import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from 'src/prisma.extension';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { SiswaService } from 'src/siswa/siswa.service';
import { PegawaiService } from 'src/pegawai/pegawai.service';

@Injectable()
export class SessionsService {
  constructor(
    @Inject('PrismaService') private prismaService: CustomPrismaService<ExtendedPrismaClient>,
    private readonly siswaService: SiswaService,
    private readonly pegawaiService: PegawaiService

  ) {

  }

  protected async validateGroup(createSessionDto: CreateSessionDto | UpdateSessionDto) {
    // validate group
    const rombels = await this.siswaService.getGroupClass()
    const groups = await this.pegawaiService.getGroup()
    if (createSessionDto.session_role_type === "SISWA") {
      if (createSessionDto.group && createSessionDto.group.length > 0) {
        const validateRombel = createSessionDto.group.filter(group => !rombels.includes(group))
        if (validateRombel.length > 0) {
          throw new BadRequestException(`Rombel ${validateRombel.join(', ')} not found`)
        }
      }
    } else if (createSessionDto.session_role_type === "PEGAWAI") {
      if (createSessionDto.group && createSessionDto.group.length > 0) {
        const validateGroup = createSessionDto.group.filter(group => !groups.includes(group))
        if (validateGroup.length > 0) {
          throw new BadRequestException(`Group ${validateGroup.join(', ')} not found`)
        }
      }
    } else {
      if (createSessionDto.group && createSessionDto.group.length > 0) {
        const validateGroupAndRombel = createSessionDto.group.filter(group => !rombels.includes(group) && !groups.includes(group))
        if (validateGroupAndRombel.length > 0) {
          throw new BadRequestException(`Group ${validateGroupAndRombel.join(', ')} not found`)
        }
      }
    }
  }

  async create(createSessionDto: CreateSessionDto) {

    const checkSessionName = await this.prismaService.client.presence_sessions.findFirst({
      where: {
        name: createSessionDto.name
      }
    })
    
    await this.validateGroup(createSessionDto);

    if (createSessionDto.gateways && createSessionDto.gateways.length) {
      if (checkSessionName) throw new BadRequestException('Session name already exist')

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
          ...createSessionDto.group && createSessionDto.group.length > 0 && {
            group: JSON.stringify(createSessionDto.group)
          },
          session_role_type: createSessionDto.session_role_type
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
      if (checkSessionName) throw new BadRequestException('Session name already exist')
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
          ...createSessionDto.group && createSessionDto.group.length > 0 && {
            group: JSON.stringify(createSessionDto.group)
          },
          session_role_type: createSessionDto.session_role_type
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
      },
      orderBy: {
        createdAt: "desc"
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

    await this.validateGroup(updateSessionDto);

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
          group: updateSessionDto.group && updateSessionDto.group.length > 0 ? JSON.stringify(updateSessionDto.group) : null,
          session_role_type: updateSessionDto.session_role_type
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
          group: JSON.stringify(updateSessionDto.group),
          session_role_type: updateSessionDto.session_role_type
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
