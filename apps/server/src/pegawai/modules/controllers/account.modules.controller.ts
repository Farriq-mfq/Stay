import { Controller, Post, Req, UseGuards } from "@nestjs/common";
import { AccessTokenPegawaiGuard } from "src/pegawai/guards/accessTokenPegawai.guard";
import { PegawaiAccountModuleService } from "../services/account.modules.service";
import { Request } from "express";

@Controller('/pegawai/modules/account')
@UseGuards(AccessTokenPegawaiGuard)
export class PegawaiAccountModuleServiceController {
    constructor(
        private readonly pegawaiAccountModuleService: PegawaiAccountModuleService
    ) { }

    @Post('/create')
    async create(
        @Req() req: Request
    ) {
        return this.pegawaiAccountModuleService.createAccount(req.user)
    }
}   