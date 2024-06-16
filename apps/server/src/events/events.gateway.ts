import { UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
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
import { ScanDto } from './dto/scan.dto';

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
    async onHandleScan(@MessageBody() data: ScanDto): Promise<void> {
        console.log(data)
        await this.gatewaysService.handleScanned({
            ip: data.ip,
            scan: data.scan
        }, this.server)
    }



}