import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { CustomPrismaService } from "nestjs-prisma";
import { ExtendedPrismaClient } from "src/prisma.extension";
import { UpdateFCMTokenDto } from "../dto/notification.dto";
import { ConfigService } from "@nestjs/config";
import { AccountableType } from "@prisma/client";

@Injectable()
export class PegawaiNotificationModuleService {
    constructor(
        @Inject("PrismaService") private readonly prismaService: CustomPrismaService<ExtendedPrismaClient>,
        private readonly configService: ConfigService
    ) { }

    async updateFcmToken(user: any, updateFcmTokenDto: UpdateFCMTokenDto) {
        if (!user) throw new UnauthorizedException()
        return await this.prismaService.client.pegawai.update({
            where: {
                id: parseInt(user.sub),
            },
            data: {
                fcm_token: updateFcmTokenDto.token,
            }
        })
    }

    async getAllNotification(user: any, limit: string, after: string, before: string, search: string) {
        if (!user) throw new UnauthorizedException()
        return await this.prismaService.client.notifications.paginate({
            where: {
                accountableId: parseInt(user.sub),
                accountableType: AccountableType.PEGAWAI,
                ...search && {
                    title: search,
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
        }).withCursor({
            limit: 10,
            after: after ?? null,
            before: before ?? null,
        });
    }

    async getCountNotification(user: any) {
        if (!user) throw new UnauthorizedException()
        return await this.prismaService.client.notifications.count({
            where: {
                accountableId: parseInt(user.sub),
                accountableType: AccountableType.PEGAWAI,
                is_read: false
            }
        })
    }
}