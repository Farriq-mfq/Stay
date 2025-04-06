import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { HomeModulesPegawaiService } from "../services/home.modules.service";
import { AccessTokenPegawaiGuard } from "src/pegawai/guards/accessTokenPegawai.guard";

@Controller('pegawai/modules/home')
@UseGuards(AccessTokenPegawaiGuard)
export class HomeModulesPegawaiController {
    constructor(
        private readonly homePegawaiModulesService: HomeModulesPegawaiService
    ) { }

    @Get('/latest/presence')
    async getLatestPresence(
        @Req() req: Request
    ) {
        return await this.homePegawaiModulesService.getLatestPresence(req.user)
    }

    @Get('/latest/transaction')

    async getLatestTransaction(
        @Req() req: Request

    ) {
        return await this.homePegawaiModulesService.getLatestTransaction(req.user)
    }
}