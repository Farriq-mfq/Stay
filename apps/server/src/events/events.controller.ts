import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { GatewaysHttpGuard } from "src/gateways/gateways.http.guard";
import { ScanDto } from "./dto/scan.dto";
import { EventsGateway } from "./events.gateway";
import { CreatePresenceByNisDto } from "src/presence/dto/create-presence.dto";

@Controller('events')
export class EventController {
    constructor(
        private readonly eventsGateway: EventsGateway,
    ) { }

    @Post('/scan')
    @HttpCode(HttpStatus.OK)
    @UseGuards(GatewaysHttpGuard)
    async httpScan(
        @Body() data: ScanDto
    ): Promise<void> {
        await this.eventsGateway.handleHttpScanned(data);
    }



    @Post('/nis')
    @HttpCode(HttpStatus.OK)
    async httpManualByNIS(@Body() createPresenceByNisDto: CreatePresenceByNisDto) {
        return await this.eventsGateway.handleHttpByNIS(createPresenceByNisDto);
    }
}