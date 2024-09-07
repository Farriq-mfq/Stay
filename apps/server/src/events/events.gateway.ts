import { Logger, UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
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
import { CreatePresenceByNisDto } from 'src/presence/dto/create-presence.dto';
import { PresenceService } from 'src/presence/presence.service';
import { ScanDto } from './dto/scan.dto';


// solve with socket io not connected to esp32: 
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
        private readonly presenceService: PresenceService
    ) {

    }
    handleConnection(client: any, ...args: any[]) {
        Logger.debug(`Connected client: ${client.id}`);
    }
    afterInit(server: any) {
        Logger.debug(`Connected client: ${server}`);
    }
    @WebSocketServer()
    server: Server;

    @UsePipes(new ValidationPipe())
    @UseFilters(WsExceptionFilter)
    @UseGuards(GatewaysGuard)
    @SubscribeMessage('SCAN')
    async onHandleScan(@MessageBody() data: ScanDto): Promise<void> {
        await this.gatewaysService.handleScanned({
            ip: data.ip,
            scan: data.scan
        }, this.server)
    }

    async handleHttpScanned(data: ScanDto): Promise<void> {
        await this.gatewaysService.handleScanned(data, this.server)
    }

    async handleHttpByNIS(createPresenceByNisDto: CreatePresenceByNisDto) {
        try {
            const presence = await this.presenceService.createPresenceByNis(createPresenceByNisDto)
             if (presence) {
                this.server.emit(`PRESENCE_UPDATED_${createPresenceByNisDto.session}`, presence)
            }
        } catch (e) {
            if (e instanceof Error) {
                const errorPayload = JSON.parse(e.message) as any
                // check error object 
                if (errorPayload.error) {
                    this.server.emit(`PRESENCE_ERROR_${createPresenceByNisDto.session}`, errorPayload.error)
                }

            } else {
                this.server.emit(`PRESENCE_ERROR_${createPresenceByNisDto.session}`, "Internal Server Error")
            }
        }
        try {
            await this.presenceService.createPresenceByNis(createPresenceByNisDto)
        } catch (err) {
            Logger.error(`Error creating presence by NIS: ${err.message}`);
        }
    }

}