import { Controller, Post } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { AccountableType, NotificationType } from "@prisma/client";

@Controller('notification')
export class NotificationController {
    constructor(
        private readonly notificationService: NotificationService
    ) { }

    @Post('/send')
    async sendNotif() {
        return await this.notificationService.sendPushNotification({
            body: "Ujian Akan Tiba Tanggal 20 April 2025",
            title: "Pengumuman",
            ref_id: 1,
            user_type: AccountableType.PEGAWAI,
            type: NotificationType.COMMON,
            token: "",
            visual_type: "info",
            data: {}
        })
    }
}