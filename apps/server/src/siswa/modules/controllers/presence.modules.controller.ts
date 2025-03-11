import { Controller, Get, Param, ParseIntPipe, Query, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { AccessTokenSiswaGuard } from "src/siswa/guards/accessTokenSiswa.guard";
import { SiswaModulesPresenceService } from "../services/presence.modules.service";

@Controller('siswa/modules/presence')
@UseGuards(AccessTokenSiswaGuard)
export class SiswaModulesPresenceController {
    constructor(private readonly siswaModulesPresenceService: SiswaModulesPresenceService) { }
    @Get('/')
    async getPresence(
        @Req() req: Request,
        @Query('limit') limit?: string,
        @Query('before') before?: string,
        @Query('after') after?: string,
        @Query('search') search?: string,
    ) {
        return await this.siswaModulesPresenceService.findAll(req.user, limit, after, before, search);
    }
    @Get('/:id')
    async getDetailPresence(
        @Req() req: Request,
        @Param('id', new ParseIntPipe()) id: string
    ) {
        return await this.siswaModulesPresenceService.find(req.user, id);
    }
}