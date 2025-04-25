import { InjectQueue } from '@nestjs/bullmq';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { AccountableType } from '@prisma/client';
import { Queue } from 'bullmq';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from 'src/prisma.extension';
import { InputTypeUser, NotificationCreateDto } from './dto/notification.dto';

@Injectable()
export class NotificationService {
    constructor(
        @Inject('PrismaService') private prismaService: CustomPrismaService<ExtendedPrismaClient>,
        @InjectQueue('notification-queue') private readonly notificationQueue: Queue
    ) { }

    async createNotification(notificationCreateDto: NotificationCreateDto) {
        if (notificationCreateDto.user_type === InputTypeUser.PEGAWAI) {
            if (!notificationCreateDto.refs_id && notificationCreateDto.refs_id.length === 0) throw new BadRequestException("Pegawai harus dipilih");
            const pegawais = await this.prismaService.client.pegawai.findMany({
                where: {
                    id: {
                        in: notificationCreateDto.refs_id
                    },
                    fcm_token: {
                        not: null
                    }
                }
            })

            if (pegawais.length === 0) throw new BadRequestException("Pegawai yang dipilih tidak memungkinkan untuk mendapatkan notifikasi");
            for (const pegawai of pegawais) {
                await this.notificationQueue.add('send-notification', { name: pegawai.name, title: notificationCreateDto.title, body: notificationCreateDto.body, token: pegawai.fcm_token, ref_id: pegawai.id, user_type: notificationCreateDto.user_type, type: notificationCreateDto.type }, {
                    removeOnComplete: true,
                    removeOnFail: true
                })
            }
        } else if (notificationCreateDto.user_type === AccountableType.SISWA) {
            if (!notificationCreateDto.refs_id && notificationCreateDto.refs_id.length === 0) throw new BadRequestException("Siswa harus dipilih");
            const siswas = await this.prismaService.client.siswa.findMany({
                where: {
                    id: {
                        in: notificationCreateDto.refs_id
                    },
                    fcm_token: {
                        not: null
                    }
                }
            })
            for (const siswa of siswas) {
                await this.notificationQueue.add('send-notification', { name: siswa.name, title: notificationCreateDto.title, body: notificationCreateDto.body, token: siswa.fcm_token, ref_id: siswa.id, user_type: AccountableType.SISWA, type: notificationCreateDto.type }, {
                    removeOnComplete: true,
                    removeOnFail: true
                })
            }
        } else if (notificationCreateDto.user_type === InputTypeUser.COMMON) {
            const pegawais = await this.prismaService.client.pegawai.findMany({
                where: {
                    fcm_token: {
                        not: null
                    }
                }
            })

            const siswas = await this.prismaService.client.siswa.findMany({
                where: {
                    fcm_token: {
                        not: null
                    }
                }
            })

            if (pegawais.length === 0 && siswas.length === 0) throw new BadRequestException("Pegawai dan Siswa yang dipilih tidak memungkinkan untuk mendapatkan notifikasi");

            for (const pegawai of pegawais) {
                await this.notificationQueue.add('send-notification', { name: pegawai.name, title: notificationCreateDto.title, body: notificationCreateDto.body, token: pegawai.fcm_token, ref_id: pegawai.id, user_type: AccountableType.PEGAWAI, type: notificationCreateDto.type }, {
                    removeOnComplete: true,
                    removeOnFail: true
                })
            }

            for (const siswa of siswas) {
                await this.notificationQueue.add('send-notification', { name: siswa.name, title: notificationCreateDto.title, body: notificationCreateDto.body, token: siswa.fcm_token, ref_id: siswa.id, user_type: AccountableType.SISWA, type: notificationCreateDto.type }, {
                    removeOnComplete: true,
                    removeOnFail: true
                })
            }
        } else {
            throw new BadRequestException("Please select Pegawai or Siswa")
        }
    }
}