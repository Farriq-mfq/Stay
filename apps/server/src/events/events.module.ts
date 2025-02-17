import { Global, Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { PrismaService } from 'nestjs-prisma';
import { GatewaysModule } from 'src/gateways/gateways.module';
import { GatewaysService } from 'src/gateways/gateways.service';
import { EventController } from './events.controller';
@Module({
    imports: [GatewaysModule],
    controllers: [EventController],
    providers: [EventsGateway, PrismaService, GatewaysService],
    exports: [EventsGateway]
})
export class EventsModule { }