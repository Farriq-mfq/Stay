import { Body, Controller, Get, Patch, Query, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { AccessTokenSiswaGuard } from "src/siswa/guards/accessTokenSiswa.guard";
import { UpdateFCMTokenDto } from "../dto/notification.dto";
import { SiswaNotificationModuleService } from "../services/notification.modules.service";

@Controller('/siswa/modules/notification')
@UseGuards(AccessTokenSiswaGuard)
export class SiswaNotificationModuleServiceController {
    constructor(
        private readonly siswaNotificationModuleService: SiswaNotificationModuleService
    ) { }

    @Patch('/fcm-token')
    async updateFcmToken(@Req() req: Request, @Body() updateFcmTokenDto: UpdateFCMTokenDto) {
        return await this.siswaNotificationModuleService.updateFcmToken(req.user, updateFcmTokenDto)
    }

    @Get('/')
    async getFindAllLeave(
        @Req() req: Request,
        @Query('limit') limit: string,
        @Query('after') after: string,
        @Query('before') before: string,
        @Query('search') search: string
    ) {
        return await this.siswaNotificationModuleService.getAllNotification(req.user, limit, after, before, search)
    }

    @Get('/unread-notification')
    async getCountNotification(@Req() req: Request) {
        return await this.siswaNotificationModuleService.getCountNotification(req.user)
    }
}