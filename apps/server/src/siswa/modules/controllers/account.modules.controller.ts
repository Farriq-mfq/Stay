import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { AccessTokenSiswaGuard } from "src/siswa/guards/accessTokenSiswa.guard";
import { ConfirmPinSiswaDto, RegisterPinSiswaDto, TransferAccountSiswaDto } from "../dto/account.dto";
import { SiswaAccountModuleService } from "../services/account.modules.service";

@Controller('/siswa/modules/account')
@UseGuards(AccessTokenSiswaGuard)
export class SiswaAccountModuleController {
    constructor(
        private readonly siswaAccountModuleService: SiswaAccountModuleService
    ) { }

    @Get('/')
    async myAccount(
        @Req() req: Request
    ) {
        return await this.siswaAccountModuleService.myAccount(req.user)
    }

    @Post('/create')
    async create(
        @Req() req: Request
    ) {
        return await this.siswaAccountModuleService.createAccount(req.user)
    }

    @Get('/search')
    async searchAccount(
        @Req() req: Request,
        @Query('account_number') account_number: string) {
        return await this.siswaAccountModuleService.searchAccount(req.user, account_number)
    }

    @Post('/transfer')
    async transfer(
        @Req() req: Request,
        @Body() transferDto: TransferAccountSiswaDto) {
        return await this.siswaAccountModuleService.transfer(req.user, transferDto)
    }

    @Post('/confirm-pin')
    async confirmPin(
        @Req() req: Request,
        @Body() confirmPinDto: ConfirmPinSiswaDto
    ) {
        return await this.siswaAccountModuleService.confirmPin(req.user, confirmPinDto)
    }

    @Post('/register-pin')
    async registerPin(
        @Req() req: Request,
        @Body() registerPinDto: RegisterPinSiswaDto
    ) {
        return await this.siswaAccountModuleService.registerPin(req.user, registerPinDto)
    }
}   