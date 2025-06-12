import { BadRequestException, Inject, InternalServerErrorException, Logger, NotFoundException, UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import {
    MessageBody,
    OnGatewayConnection,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from '@nestjs/websockets';
import { presence_sessions, presences, presences_pegawai } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';
import { Server } from 'socket.io';
import { WsExceptionFilter } from 'src/exceptions/wsExceptionFilter';
import { GatewaysGuard } from 'src/gateways/gateways.guard';
import { GatewaysService } from 'src/gateways/gateways.service';
import { CreatePresenceByManual } from 'src/presence/dto/create-presence.dto';
import { PresenceService } from 'src/presence/presence.service';
import { ExtendedPrismaClient } from 'src/prisma.extension';
import { ScanDto } from './dto/scan.dto';

// solve socket io not connected to esp32: 
// https://stackoverflow.com/questions/54800516/socketio-server-not-connecting-to-esp8266
@WebSocketGateway({
    cors: {
        origin: '*',
    },
    methods: ["GET", "POST"],
    transports: ["websocket", "polling"],
    credentials: true,
    allowEIO3: true
})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection {
    constructor(
        private readonly gatewaysService: GatewaysService,
        private readonly presenceService: PresenceService,
        @Inject("PrismaService") private prismaService: CustomPrismaService<ExtendedPrismaClient>,
    ) {

    }
    async handleConnection(client: any, ...args: any[]) {
        const address = client.handshake.headers['x-forwarded-for'] || client.conn.remoteAddress.split(":")[3];
        const userAgent = client.handshake.headers['user-agent'];
        const authToken = client.handshake.auth;
        const queries = client.handshake.query

        Logger.debug(`Connected client: ${client.id}`);

        try {
            if (!queries.clientId) throw Error("clientId is required")
            // store connected client
            await this.prismaService.client.connected_clients.upsert({
                where: {
                    clientId: queries.clientId,
                },
                create: {
                    clientId: queries.clientId,
                    ip: address,
                    userAgent: userAgent,
                    socketId: client.id
                },
                update: {
                    socketId: client.id
                }
            })
        } catch {
            Logger.error("error while insert connected client")
        }
    }
    async handleDisconnect(client: any) {
        // const address = client.handshake.address;
        // const userAgent = client.handshake.headers['user-agent'];
        // const authToken = client.handshake.auth;
        const queries = client.handshake.query
        Logger.debug(`Disconnected client: ${client.id}`);

        try {
            // remove when disconnect
            const checkClientExist = await this.prismaService.client.connected_clients.findFirst({
                where: {
                    clientId: queries.clientId
                }
            })

            if (checkClientExist) {
                await this.prismaService.client.connected_clients.delete({
                    where: {
                        id: checkClientExist.id
                    }
                })
            }

        } catch {
            Logger.error("Error remove connected client");
        }
    }
    async afterInit(server: any) {
        Logger.debug(`Connected client: ${server}`);
        // i will connected adapter to redis for solve cluster pm2 running
        // solve with remove cluster running
    }
    @WebSocketServer()
    server: Server;

    @UsePipes(new ValidationPipe())
    @UseFilters(WsExceptionFilter)
    @UseGuards(GatewaysGuard)
    @SubscribeMessage('SCAN')
    async onHandleScan(@MessageBody() data: ScanDto): Promise<void> {
        await this.gatewaysService.handleScanned(data, this.server)
    }

    async handleHttpScanned(data: ScanDto): Promise<void | presences | presences_pegawai | { message: string }> {
        return await this.gatewaysService.handleScanned(data, this.server)
    }
    async handleHttpPresenceQr(data: Pick<ScanDto, 'ip' | 'token'> & { ref: number }, type: 'siswa' | 'pegawai'): Promise<void | presences | presences_pegawai | { message: string }> {
        const gateway = await this.prismaService.client.gateways.findUniqueOrThrow({
            where: {
                // ip: data.ip,
                token: data.token
            },
            include: {
                presence_sessions: true
            }
        })

        try {
            if (gateway.presence_sessions.session_role_type === 'PEGAWAI' && type === 'pegawai') {
                const presence = await this.presenceService.createPresenceByQR(data, gateway, this.server, type);
                this.server.emit(`PRESENCE_UPDATED_${presence.presence_sessionsId}`, presence)
                return presence
            } else if (gateway.presence_sessions.session_role_type === 'SISWA' && type === 'siswa') {
                const presence = await this.presenceService.createPresenceByQR(data, gateway, this.server, type);
                this.server.emit(`PRESENCE_UPDATED_${presence.presence_sessionsId}`, presence)
                return presence
            } else {
                if (gateway.presence_sessions.session_role_type === 'PEGAWAI') {
                    throw new BadRequestException({ message: "QRCODE HANYA BISA DIGUNAKAN UNTUK PEGAWAI" })
                } else {
                    throw new BadRequestException({ message: "QRCODE HANYA BISA DIGUNAKAN UNTUK SISWA" })
                }
            }

        } catch (e) {
            if (e instanceof NotFoundException) {
                throw new NotFoundException({ message: e.message })
            } else if (e instanceof BadRequestException) {
                throw new BadRequestException({ message: e.message })
            } else if (e instanceof Error) {
                const errorPayload = JSON.parse(e.message) as any
                if (errorPayload.error) {
                    throw new BadRequestException({ message: errorPayload.error })
                }
            } else {
                throw new InternalServerErrorException('Internal server error')
            }
        }
    }

    // presence by manual
    async handleHttpPresenceManual(createPresenceByManual: CreatePresenceByManual) {
        try {
            const presence = await this.presenceService.createPresenceByManual(createPresenceByManual);
            this.server.emit(`PRESENCE_UPDATED_${presence.presence_sessionsId}`, presence)
            return presence
        } catch (e) {
            if (e instanceof NotFoundException) {
                return {
                    message: e.message
                }
            } else if (e instanceof Error) {
                if (e.message === 'ROLE_NOT_SUPPORT') {
                    throw new BadRequestException({ message: "Sesi Presensi tidak memiliki role SISWA" })
                }
                const errorPayload = JSON.parse(e.message) as any
                if (errorPayload.error) {
                    throw new BadRequestException({ message: errorPayload.error })
                }
            } else {
                throw new InternalServerErrorException('Internal server error')
            }
        }
    }

    async handleSetSession(socket_id: string, session: presence_sessions) {
        this.server.to(socket_id).emit('session', session)
    }

    // async handleHttpByNIS(createPresenceByNisDto: CreatePresenceByNisDto) {
    //     try {
    //         const presence = await this.presenceService.createPresenceByNis(createPresenceByNisDto)
    //         this.server.emit(`PRESENCE_UPDATED_${createPresenceByNisDto.session}`, presence)
    //         return presence
    //     } catch (e) {
    //         if (e instanceof NotFoundException) {
    //             throw new NotFoundException(e.message)
    //         } else {
    //             if (e instanceof Error) {
    //                 const errorPayload = JSON.parse(e.message) as any
    //                 throw new BadRequestException(errorPayload.error)
    //             } else {
    //                 throw new InternalServerErrorException("Terjadi kesalahan")
    //             }
    //         }
    //     }
    // }


    async sendingNotificationEmitStatus(payload: any, status: 'success' | 'failed') {
        this.server.emit('sending_notification_status', {
            payload,
            status
        });
    }

    async sendNotificationEmitPayment(key: string, payload: any, status: 'success' | 'failed') {
        this.server.emit(`send_notification_payment_${key}`, {
            payload,
            status
        });
    }
}