import { Inject, UnauthorizedException } from "@nestjs/common";
import { AccountableType } from "@prisma/client";
import { CustomPrismaService } from "nestjs-prisma";
import { ExtendedPrismaClient } from "src/prisma.extension";
import { QRCodeService } from "src/qrcode/qrcode.service";

export class QrCodeSiswaModulesService {
    constructor(
        private readonly qrCodeService: QRCodeService,
        @Inject('PrismaService') private prismaService: CustomPrismaService<ExtendedPrismaClient>,
    ) { }

    async createQrCodeTransfer(user: any) {
        if (!user) throw new UnauthorizedException()
        const userId = parseInt(user.sub)

        const account = await this.prismaService.client.account.findFirst({
            where: {
                accountableId: userId,
                accountableType: AccountableType.SISWA
            }
        })
        const data = {
            ...account
        }
        return this.qrCodeService.createQrCode(data, "TRANSFER");
    }


    async createQrCodeWithdraw(data: any) {
        return this.qrCodeService.createQrCode(data, "WITHDRAW");
    }
}