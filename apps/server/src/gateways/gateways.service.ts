import { Inject, Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import * as ping from 'net-ping';
import { ExtendedPrismaClient } from 'src/prisma.extension';
import { TokenService } from 'src/services/token.service';
import { CreateGatewayDto } from './dto/create-gateway.dto';
import { UpdateGatewayDto } from './dto/update-gateway.dto';
@Injectable()
export class GatewaysService {
  constructor(
    @Inject('PrismaService') private prismaService: CustomPrismaService<ExtendedPrismaClient>,
    private readonly tokenService: TokenService
  ) {

  }
  async create(createGatewayDto: CreateGatewayDto) {
    const token = this.tokenService.generateRandomToken(16);
    return await this.prismaService.client.gateways.create({
      data: {
        token,
        ip: createGatewayDto.ip,
        location: createGatewayDto.location,
        name: createGatewayDto.name,
        role: createGatewayDto.role,
      }
    })
  }

  async findAll(
    page?: number,
    limit?: number
  ) {
    const [items, meta] = await this.prismaService.client.gateways.paginate().withPages({
      limit: limit || 10,
      includePageCount: true,
      page: page || 1
    });
    return {
      items,
      meta
    }
  }

  async findOne(id: number) {
    return await this.prismaService.client.gateways.findUniqueOrThrow({
      where: {
        id: id
      }
    });
  }

  async update(id: number, updateGatewayDto: UpdateGatewayDto) {
    return await this.prismaService.client.gateways.update({
      where: {
        id: id
      },
      data: updateGatewayDto,
    })
  }

  async remove(id: number) {
    return await this.prismaService.client.gateways.delete({
      where: {
        id: id
      }
    });
  }

  async checkPing(id: number): Promise<{
    target: string,
    status: string,
    time?: number
  }> {
    const gateway = await this.prismaService.client.gateways.findUniqueOrThrow({
      where: {
        id: id
      }
    })
    return new Promise((resolve, reject) => {
      const session = ping.createSession();
      session.pingHost(gateway.ip, function (error: any, target: string, sent: Date, rcvd: Date) {
        const ms = rcvd.getTime() - sent.getTime();
        if (error) {
          if (error instanceof ping.RequestTimedOutError) {
            resolve({ target, status: 'Not reachable (timeout)' });
          } else {
            reject({ target, status: `Error: ${error.toString()}` });
          }
        } else {
          resolve({
            target,
            status: "live",
            time: ms
          });
        }
      })
    })
  }
}
