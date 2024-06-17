import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from 'src/prisma.extension';

@Injectable()
export class SessionsService {
  constructor(
    @Inject('PrismaService') private prismaService: CustomPrismaService<ExtendedPrismaClient>,

  ) {

  }

  async create(createSessionDto: CreateSessionDto) {
    const sesison = await this.prismaService.client.presence_sessions.create({
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
          throw new BadRequestException()
        } else {
          await this.prismaService.client.gateways.updateMany({
            where: {
              id: {
                in: createSessionDto.gateways
              }
            },
            data: {
              presence_sessionsId: sesison.id
            }
          })
        }
      }
    }

    return sesison
  }

  findAll() {
    return `This action returns all sessions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} session`;
  }

  update(id: number, updateSessionDto: UpdateSessionDto) {
    return `This action updates a #${id} session`;
  }

  remove(id: number) {
    return `This action removes a #${id} session`;
  }
}
