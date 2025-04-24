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
            token: "c5UP_494SqCCilhacJDqrN:APA91bHGQha3kGUP18b69Ohvvk-cPfDpl_EnEqs6OD96mPEq36NjAHsTu74baE7V3oZpUqdh5QhRcfkkRA9t6fdp9ZyCsBC4qBenAvAwvGmJBHZ_xttPpHo",
            visual_type: "info",
            data: {}
        })
    }
}