import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { PrismaService } from 'nestjs-prisma';
import { GatewaysModule } from 'src/gateways/gateways.module';
import { GatewaysService } from 'src/gateways/gateways.service';

@Module({
    imports: [GatewaysModule],
    providers: [EventsGateway, PrismaService, GatewaysService],
})
export class EventsModule { }