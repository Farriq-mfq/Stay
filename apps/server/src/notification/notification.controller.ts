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
            token: "cQO_ca8cSISojwfVFtcxY1:APA91bFZj0MmGVCSDvs4k1srwcYNs6MnOKdrvupMyBGxzAWW8U_I5OIAMT_avx9R7_50LLnAtTqISRtUYIvWq0_OrHrQc8IottWS6Nkc-ldfbacq4VGJuIY",
            visual_type: "info",
            data: {}
        })
    }
}