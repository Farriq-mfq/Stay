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
            body: "Pengumuman",
            title: "Hello welcome",
            ref_id: 1,
            user_type: AccountableType.PEGAWAI,
            type: NotificationType.COMMON,
            token: "frbN8rkWTwWPuRB_y9Hw2C:APA91bFVMnng4W3kPvxgfz4A-2NoMiRVdS-EtoPeJx4dm0buYOdd5d7eUqlHq7Hl6_g0SSufwqrFJSJAHWV3vZ1uyvT-zHPbli7y02OE1zGZhWCmm8_5-SA",
            visual_type: "info",
            data: {}
        })
    }
}