import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Req, UseGuards } from "@nestjs/common";
import { PegawaiModulesPresenceService } from "../services/presence.modules.service";
import { AccessTokenPegawaiGuard } from "src/pegawai/guards/accessTokenPegawai.guard";
import { Request } from "express";
import { PresenceLocationDto } from "../dto/presence.dto";
import { PegawaiGroupGuard } from "src/guards/pegawai-group.guard";
import { Groups } from "src/decorators/group.decorator";

@Controller('pegawai/modules/presence')
@UseGuards(AccessTokenPegawaiGuard, PegawaiGroupGuard)
export class PegawaiModulesPresenceController {
    constructor(private readonly pegawaiModulesPresenceService: PegawaiModulesPresenceService) { }
    @Get('/')
    async getPresence(
        @Req() req: Request,
        @Query('limit') limit?: string,
        @Query('before') before?: string,
        @Query('after') after?: string,
        @Query('search') search?: string,
    ) {
        return await this.pegawaiModulesPresenceService.findAll(req.user, limit, after, before, search);
    }

    @Get('/location')
    @Groups('TATA USAHA', 'GURU TAMU')
    async readCurrentSessionAndPresence(
        @Req() req: Request,
    ) {
        return await this.pegawaiModulesPresenceService.readCurrentSessionAndPresence(req.user)
    }

    @Get('/:id')
    async getDetailPresence(
        @Req() req: Request,
        @Param('id', new ParseIntPipe()) id: string
    ) {
        return await this.pegawaiModulesPresenceService.find(req.user, id);
    }


    @Post('/location')
    @Groups('TATA USAHA', 'GURU TAMU')
    async createPresenceByLocation(
        @Req() req: Request,
        @Body() presenceLocationDto: PresenceLocationDto
    ) {
        return await this.pegawaiModulesPresenceService.createPresenceByLocation(req.user, presenceLocationDto)
    }
}