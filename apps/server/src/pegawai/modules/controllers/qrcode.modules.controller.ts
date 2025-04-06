import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { QrCodePegawaiModulesService } from "../services/qrcode.modules.service";
import { Request } from "express";
import { AccessTokenPegawaiGuard } from "src/pegawai/guards/accessTokenPegawai.guard";
import { ReadQRCodeDto } from "../dto/qrcode.dto";

@Controller('/pegawai/modules/qrcode')
@UseGuards(AccessTokenPegawaiGuard)
export class QrCodePegawaiModulesController {

    constructor(
        private readonly qrCodePegawaiModulesService: QrCodePegawaiModulesService
    ) { }

    @Get('/')
    async createQrCodeTransfer(
        @Req() req: Request
    ) {
        return await this.qrCodePegawaiModulesService.createQrCodeTransfer(req.user)
    }

    @Post('/scan')
    async readQRCode(
        @Req() req: Request,
        @Body() readQRCodeDto: ReadQRCodeDto
    ) {
        return await this.qrCodePegawaiModulesService.readQRCode(req.user, readQRCodeDto)
    }
}