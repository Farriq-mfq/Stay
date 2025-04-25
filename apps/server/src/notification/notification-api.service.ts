import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { CustomPrismaService } from "nestjs-prisma";
import { ExtendedPrismaClient } from "src/prisma.extension";
import * as admin from 'firebase-admin';
import { NotificationDto } from "./dto/notification.dto";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class NotificationApiService {
    constructor(
        @Inject('PrismaService') private prismaService: CustomPrismaService<ExtendedPrismaClient>,
        private readonly configService: ConfigService
    ) { }

    async sendPushNotification({ title, body, token, ref_id, user_type, type, data }: NotificationDto) {

        const notification = await this.prismaService.client.notifications.create({
            data: {
                title,
                body,
                accountableId: ref_id,
                accountableType: user_type,
                type: type,
                data: JSON.stringify(data)
            }
        })


        try {
            await admin.messaging().send({
                notification: {
                    body: notification.body,
                    title: this.configService.get('APP_NAME'),
                },
                token,
                ...data && {
                    webpush: {
                        data: {
                            "type": notification.type,
                            "payload": JSON.stringify(data)
                        }
                    }
                }
            });
            return true
        } catch (err) {
            throw new BadRequestException(err)
        }
    }
}