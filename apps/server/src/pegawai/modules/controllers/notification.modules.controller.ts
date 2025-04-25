import { Body, Controller, Get, Patch, Query, Req, UseGuards } from "@nestjs/common";
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

    @Get('/')
    async getFindAllLeave(
        @Req() req: Request,
        @Query('limit') limit: string,
        @Query('after') after: string,
        @Query('before') before: string,
        @Query('search') search: string
    ) {
        return await this.pegawaiNotificationModuleService.getAllNotification(req.user, limit, after, before, search)
    }

    @Get('/unread-notification')
    async getCountNotification(@Req() req: Request) {
        return await this.pegawaiNotificationModuleService.getCountNotification(req.user)
    }
}