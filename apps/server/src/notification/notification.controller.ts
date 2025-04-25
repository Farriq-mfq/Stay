import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { NotificationCreateDto } from "./dto/notification.dto";
import { NotificationService } from "./notification.service";
import { PermissionGuard } from "src/guards/permissions.guard";
import { AccessTokenGuard } from "src/guards/accessToken.guard";
import { Permissions } from "src/decorators/permission.decorator";
@Controller('notification')
@UseGuards(AccessTokenGuard, PermissionGuard)
export class NotificationController {
    constructor(
        private readonly notificationService: NotificationService,
    ) { }

    @Post('/send')
    @Permissions('notification:send')
    async sendNotif(
        @Body() notificationCreateDto: NotificationCreateDto
    ) {
        return await this.notificationService.createNotification(notificationCreateDto)
    }
}