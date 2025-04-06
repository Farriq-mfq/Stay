import { BadRequestException, Inject, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { AccountableType } from "@prisma/client";
import { CustomPrismaService } from "nestjs-prisma";
import { ExtendedPrismaClient } from "src/prisma.extension";
import { QRCodeService } from "src/qrcode/qrcode.service";
import { EventsGateway } from "src/events/events.gateway";
import { ReadQRCodeDto } from "../dto/qrcode.dto";

export class QrCodePegawaiModulesService {
    constructor(
        private readonly qrCodeService: QRCodeService,
        @Inject('PrismaService') private prismaService: CustomPrismaService<ExtendedPrismaClient>,
        private readonly eventService: EventsGateway
    ) { }

    async createQrCodeTransfer(user: any) {
        if (!user) throw new UnauthorizedException()
        const userId = parseInt(user.sub)

        const account = await this.prismaService.client.account.findFirst({
            where: {
                accountableId: userId,
                accountableType: AccountableType.PEGAWAI
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

                    const pegawai = await this.prismaService.client.pegawai.findUniqueOrThrow({
                        where: {
                            id: parseInt(user.sub)
                        }
                    })

                    const gateway = await this.prismaService.client.gateways.findUniqueOrThrow({
                        where: {
                            token: decrypt.data.token
                        }
                    })

                    await this.eventService.handleHttpPresenceQr({
                        ip: gateway.ip,
                        token: gateway.token,
                        ref: pegawai.id,
                    }, 'pegawai')

                    delete decrypt.data
                    return decrypt

                case 'WITHDRAW':
                default:
                    throw new BadRequestException("invalid action")
            }

        } catch (err) {
            if (err instanceof BadRequestException) {
                throw new BadRequestException(err.message)
            } else if (err instanceof NotFoundException) {
                throw new NotFoundException(err.message)
            } else {
                throw new InternalServerErrorException("unknown error")
            }
        }

    }
}