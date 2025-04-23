import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from 'src/prisma.extension';
import { NotificationDto } from './dto/notification.dto';

@Injectable()
export class NotificationService {
    constructor(
        @Inject('PrismaService') private prismaService: CustomPrismaService<ExtendedPrismaClient>,
    ) { }
    async sendPushNotification({ title, body, token, ref_id, user_type, type, data }: NotificationDto) {

        const notification = await this.prismaService.client.notifications.create({
            data: {
                title,
                body,
                accountableId: ref_id,
                accountableType: user_type,
                type: type,
                ...data && {
                    data: JSON.stringify(data)
                }
            }
        })

        try {
            await admin.messaging().send({
                notification: {
                    body: notification.body,
                    title: notification.title,
                },
                token,
                ...data && {
                    webpush: {
                        data: {
                            type: notification.type,
                            ...data
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