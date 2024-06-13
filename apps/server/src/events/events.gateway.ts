import { UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayInit,
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
export class EventsGateway implements OnGatewayInit, OnGatewayConnection {
    constructor(
        private readonly gatewaysService: GatewaysService
    ) {

    }
    handleConnection(client: any, ...args: any[]) {
        console.log("connected")
    }
    afterInit(server: any) {
        console.log("connected")
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
        }, this.server)
    }



}