import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { GatewaysHttpGuard } from "src/gateways/gateways.http.guard";
import { ScanDto } from "./dto/scan.dto";
import { EventsGateway } from "./events.gateway";
import { CreatePresenceByNisDto } from "src/presence/dto/create-presence.dto";
import { presences, siswa } from "@prisma/client";

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
    ) {
        return await this.eventsGateway.handleHttpScanned(data);

        // todo: do not remove that
        // ): Promise<void | { siswa: string } | { message: string }> {
        // lcd i2c render text
        // const result = await this.eventsGateway.handleHttpScanned(data);
        // if (result) {

        //     if ("message" in result) {
        //         return {
        //             message: result.message
        //         }
        //     }
        //     type presenceSiswaType = presences & {
        //         siswa: siswa
        //     }


        //     const siswa = (result as presenceSiswaType).siswa
        //     return {
        //         siswa: `${siswa.name.slice(0, 15)}...`,
        //     }
        // }
    }



    // @Post('/nis')
    // @HttpCode(HttpStatus.OK)
    // async httpManualByNIS(@Body() createPresenceByNisDto: CreatePresenceByNisDto) {
    //     return await this.eventsGateway.handleHttpByNIS(createPresenceByNisDto);
    // }
}