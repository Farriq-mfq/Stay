import { Body, Controller, Get, Patch, Req, UseGuards } from "@nestjs/common";
import { AccessTokenPegawaiGuard } from "src/pegawai/guards/accessTokenPegawai.guard";
import { PegawaiNotificationModuleService } from "../services/notification.modules.service";
import { Request } from "express";
import { UpdateFCMTokenDto } from "../dto/notification.dto";

@Controller('/pegawai/modules/notification')
@UseGuards(AccessTokenPegawaiGuard)
export class PegawaiNotificationModuleServiceController {
    constructor(
        private readonly pegawaiNotificationModuleService: PegawaiNotificationModuleService
    ) { }

    @Patch('/fcm-token')
    async updateFcmToken(@Req() req: Request, @Body() updateFcmTokenDto: UpdateFCMTokenDto) {
        return await this.pegawaiNotificationModuleService.updateFcmToken(req.user, updateFcmTokenDto)
    }

    @Get('/vapid-key')
    async getVapidKey() {
        return await this.pegawaiNotificationModuleService.getVapidKey()
    }
}