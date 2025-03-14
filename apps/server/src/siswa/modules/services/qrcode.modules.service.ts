import { BadRequestException, Inject, UnauthorizedException } from "@nestjs/common";
import { AccountableType } from "@prisma/client";
import { CustomPrismaService } from "nestjs-prisma";
import { ExtendedPrismaClient } from "src/prisma.extension";
import { QRCodeService } from "src/qrcode/qrcode.service";
import { ReadQRCodeDto } from "../dto/qrcode.dto";

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

    async readQRCode(user: any, readQRCodeDto: ReadQRCodeDto) {
        if (!user) throw new UnauthorizedException()

        try {
            const decrypt = await this.qrCodeService.decryptQrCode<any>(readQRCodeDto.code)
            switch (decrypt.action) {
                case "TRANSFER":
                    const data = decrypt.data
                    const fromAccount = await this.prismaService.client.account.findFirst({
                        where: {
                            accountableId: parseInt(user.sub),
                            accountableType: AccountableType.SISWA
                        },
                    });
                    if (!fromAccount) throw new BadRequestException("Account not found")

                    const toAccount = await this.prismaService.client.account.findUniqueOrThrow({
                        where: {
                            accountNumber: data.accountNumber,
                        }
                    })


                    if (fromAccount.accountNumber === toAccount.accountNumber) throw new BadRequestException("Transfer to same account not allowed")

                    return decrypt
                case 'PRESENCE':
                case 'WITHDRAW':
                default:
                    throw new BadRequestException("invalid action")
            }

        } catch (err) {
            throw new BadRequestException("invalid code")
        }

    }
}