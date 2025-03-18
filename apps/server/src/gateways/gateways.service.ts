import { Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { presences, presences_pegawai } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';
import * as ping from 'net-ping';
import { Server } from 'socket.io';
import { ScanDto } from 'src/events/dto/scan.dto';
import { PresenceService } from 'src/presence/presence.service';
import { ExtendedPrismaClient } from 'src/prisma.extension';
import { TokenService } from 'src/services/token.service';
import { CreateGatewayDto, RoleGatewayType } from './dto/create-gateway.dto';
import { UpdateGatewayDto } from './dto/update-gateway.dto';
import { QRCodeService } from 'src/qrcode/qrcode.service';
@Injectable()
export class GatewaysService {
  constructor(
    @Inject('PrismaService') private prismaService: CustomPrismaService<ExtendedPrismaClient>,
    private readonly tokenService: TokenService,
    private readonly jwtService: JwtService,
    private readonly presenceService: PresenceService,
    private readonly qrcodeService: QRCodeService
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
    limit?: number,
    search?: string,
    role?: RoleGatewayType
  ) {

    const [items, meta] = await this.prismaService.client.gateways.paginate({
      select: {
        id: true,
        name: true,
        ip: true,
        location: true,
        role: true,
        status: true,
        token: true
      },
      where: {
        ...search && {
          OR: [
            {
              name: {
                contains: search,
                mode: 'insensitive'
              },
            },
            {
              ip: {
                contains: search,
                mode: 'insensitive'
              },
            }
          ],
        },

        ...role && {
          role
        }
      }
    }).withPages({
      limit: limit ?? 10,
      includePageCount: true,
      page: page ?? 1
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
      },
      select: {
        id: true,
        name: true,
        ip: true,
        location: true,
        role: true,
        status: true,
        token: true
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

  async generateSecureToken(id: number) {
    const gateway = await this.prismaService.client.gateways.findUniqueOrThrow({
      where: {
        id: id
      }
    })

    const token = await this.tokenService.generateRandomToken(16);
    const updated = await this.prismaService.client.gateways.update({
      where: {
        id: gateway.id
      },
      data: {
        token
      }
    })
    if (updated) {
      return token
    } else {
      throw new InternalServerErrorException("unknown error")
    }

  }


  async handleScanned(
    data: ScanDto,
    client: Server
  ): Promise<presences | presences_pegawai | { message: string }> {
    try {
      const gateway = await this.prismaService.client.gateways.findUniqueOrThrow({
        where: {
          // ip: data.ip,
          token: data.token
        },
      })

      switch (gateway.role) {
        case 'presence':
          try {
            const presence = await this.presenceService.createPresenceByScanned(data, gateway, client)

            if (presence) {
              client.emit(`PRESENCE_UPDATED_${gateway.presence_sessionsId}`, presence)
              return presence;
            }

          } catch (e) {
            if (e instanceof NotFoundException) {
              client.emit(`PRESENCE_ERROR_${gateway.presence_sessionsId}`, e.message)
              return {
                message: e.message
              }
            } else if (e instanceof Error) {
              console.log(e)
              const errorPayload = JSON.parse(e.message) as any
              // check error object 
              if (errorPayload.error) {
                client.emit(`PRESENCE_ERROR_${gateway.presence_sessionsId}`, errorPayload.error)
                // try to show to lcd module
                return {
                  message: errorPayload.error
                }
              }

            } else {
              throw new InternalServerErrorException('Internal server error')
            }
          }
          break;
        case 'register':
          client.emit(`READER_${gateway.token}`, data.scan)
          return {
            message: 'KARTU TERBACA'
          }
          break;
        default:
          throw new InternalServerErrorException('Role not registered')
      }
    } catch (err) {
      Logger.error(err)
    }

  }
  /**
   * this optional use
   */
  async updateRealtimePresence({
    client,
    sessionId
  }: {
    client: Server,
    sessionId: number
  }) {
    const timeoutId = setTimeout(() => {
      client.emit(`PRESENCE_UPDATED_${sessionId}`, true, (ack) => {
        if (ack) {
          clearTimeout(timeoutId);
        }
      })
    }, 5000)
  }


  async generateQrCode(id: number) {
    const gateway = await this.prismaService.client.gateways.findUniqueOrThrow({
      where: {
        id: id
      }
    })
    return await this.qrcodeService.createQrCode({
      token: gateway.token
    }, 'PRESENCE')
  }
}
