import { Inject, Injectable } from '@nestjs/common';
import { NotificationDto } from './dto/notification.dto';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from 'src/prisma.extension';
@Injectable()
export class NotificationService {
    constructor(
        @Inject('PrismaService') private prismaService: CustomPrismaService<ExtendedPrismaClient>,
    ) { }
    async find() { }
    async create(
        notificationDto: NotificationDto
    ) {
        return await this.prismaService.client.notifications.create({
            data: {
                title: notificationDto.title,
                message: notificationDto.message,
                siswa: {
                    connect: {
                        id: notificationDto.siswaId,
                    },
                },
            },
        })
    }
    async remove() { }
    async updateStatus() { }
}