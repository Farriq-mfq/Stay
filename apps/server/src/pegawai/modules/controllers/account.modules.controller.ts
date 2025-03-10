import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { AccessTokenPegawaiGuard } from "src/pegawai/guards/accessTokenPegawai.guard";
import { PegawaiAccountModuleService } from "../services/account.modules.service";
import { TransferAccountPegawaiDto } from "../dto/account.dto";

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

    @Get('/search')
    async searchAccount(
        @Req() req: Request,
        @Query('account_number') account_number: string) {
        return await this.pegawaiAccountModuleService.searchAccount(req.user, account_number)
    }

    @Post('/transfer')
    async transfer(
        @Req() req: Request,
        @Body() transferDto: TransferAccountPegawaiDto) {
        return await this.pegawaiAccountModuleService.transfer(req.user, transferDto)
    }
}   