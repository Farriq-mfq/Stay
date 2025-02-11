import { BadRequestException, InternalServerErrorException, Logger, NotFoundException, UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import {
    MessageBody,
    OnGatewayConnection,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { WsExceptionFilter } from 'src/exceptions/wsExceptionFilter';
import { GatewaysGuard } from 'src/gateways/gateways.guard';
import { GatewaysService } from 'src/gateways/gateways.service';
import { CreatePresenceByManual, CreatePresenceByNisDto } from 'src/presence/dto/create-presence.dto';
import { PresenceService } from 'src/presence/presence.service';
import { ScanDto } from './dto/scan.dto';
import { ConfigService } from '@nestjs/config';
import { presences, presences_pegawai } from '@prisma/client';

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
        private readonly configService: ConfigService
    ) {

    }
    handleConnection(client: any, ...args: any[]) {
        Logger.debug(`Connected client: ${client.id}`);
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
                const errorPayload = JSON.parse(e.message) as any
                if (errorPayload.error) {
                    throw new BadRequestException({ message: errorPayload.error })
                }
            } else {
                throw new InternalServerErrorException('Internal server error')
            }
        }
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

}