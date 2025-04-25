import { Body, Controller, Post } from "@nestjs/common";
import { NotificationCreateDto } from "./dto/notification.dto";
import { NotificationService } from "./notification.service";
@Controller('notification')
export class NotificationController {
    constructor(
        private readonly notificationService: NotificationService,
    ) { }

    @Post('/send')
    async sendNotif(
        @Body() notificationCreateDto: NotificationCreateDto
    ) {
        return await this.notificationService.createNotification(notificationCreateDto)
    }
}