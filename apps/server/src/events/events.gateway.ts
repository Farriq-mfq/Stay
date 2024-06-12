import { UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsExceptionFilter } from 'src/exceptions/wsExceptionFilter';
import { ScanDto } from './dto/scan.dto';
import { GatewaysGuard } from 'src/gateways/gateways.guard';
import { GatewaysService } from 'src/gateways/gateways.service';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class EventsGateway {
    constructor(
        private readonly gatewaysService: GatewaysService
    ) {

    }
    @WebSocketServer()
    server: Server;

    @UsePipes(new ValidationPipe())
    @UseFilters(WsExceptionFilter)
    @UseGuards(GatewaysGuard)
    @SubscribeMessage('SCAN')
    async onHandleScan(@MessageBody() data: ScanDto, @ConnectedSocket() client: Socket): Promise<void> {
        await this.gatewaysService.handleScanned({
            ip: data.ip,
            scan: data.scan
        }, client)
    }



}