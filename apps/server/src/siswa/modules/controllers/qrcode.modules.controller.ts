import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { QrCodeSiswaModulesService } from "../services/qrcode.modules.service";
import { Request } from "express";
import { AccessTokenSiswaGuard } from "src/siswa/guards/accessTokenSiswa.guard";
import { ReadQRCodeDto } from "../dto/qrcode.dto";

@Controller('/siswa/modules/qrcode')
@UseGuards(AccessTokenSiswaGuard)
export class QrCodeSiswaModulesController {

    constructor(
        private readonly qrCodeSiswaModulesService: QrCodeSiswaModulesService
    ) { }

    @Get('/')
    async createQrCodeTransfer(
        @Req() req: Request
    ) {
        return await this.qrCodeSiswaModulesService.createQrCodeTransfer(req.user)
    }

    @Post('/scan')
    async readQRCode(
        @Req() req: Request,
        @Body() readQRCodeDto: ReadQRCodeDto
    ) {
        return await this.qrCodeSiswaModulesService.readQRCode(req.user, readQRCodeDto)
    }
}