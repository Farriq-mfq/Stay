import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { CustomPrismaService } from "nestjs-prisma";
import { ExtendedPrismaClient } from "src/prisma.extension";
import { UpdateFCMTokenDto } from "../dto/notification.dto";

@Injectable()
export class PegawaiNotificationModuleService {
    constructor(
        @Inject("PrismaService") private readonly prismaService: CustomPrismaService<ExtendedPrismaClient>,
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
}