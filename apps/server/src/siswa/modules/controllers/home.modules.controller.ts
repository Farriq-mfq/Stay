import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { HomeModulesSiswaService } from "../services/home.modules.service";
import { AccessTokenSiswaGuard } from "src/siswa/guards/accessTokenSiswa.guard";
import { Request } from "express";

@Controller('siswa/modules/home')
@UseGuards(AccessTokenSiswaGuard)
export class HomeModulesSiswaController {
    constructor(
        private readonly homeSiswaModulesService: HomeModulesSiswaService
    ) { }

    @Get('/latest/presence')
    async getLatestPresence(
        @Req() req: Request
    ) {
        return await this.homeSiswaModulesService.getLatestPresence(req.user)
    }

    @Get('/latest/transaction')

    async getLatestTransaction(
        @Req() req: Request

    ) {
        return await this.homeSiswaModulesService.getLatestTransaction(req.user)
    }
}