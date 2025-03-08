import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
import { PegawaiModulesPresenceService } from "../services/presence.modules.service";
import { AccessTokenPegawaiGuard } from "src/pegawai/guards/accessTokenPegawai.guard";
import { Request } from "express";

@Controller('pegawai/modules/presence')
@UseGuards(AccessTokenPegawaiGuard)
export class PegawaiModulesPresenceController {
    constructor(private readonly pegawaiModulesPresenceService: PegawaiModulesPresenceService) { }
    @Get('/')
    async getPresence(
        @Req() req: Request,
        @Query('limit') limit?: number,
        @Query('before') before?: string,
        @Query('after') after?: string,
    ) {
        return await this.pegawaiModulesPresenceService.findAll(req.user, limit, after, before);
    }
}