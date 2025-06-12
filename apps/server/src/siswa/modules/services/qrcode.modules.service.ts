import { BadRequestException, Inject, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { AccountableType } from "@prisma/client";
import { CustomPrismaService } from "nestjs-prisma";
import { EventsGateway } from "src/events/events.gateway";
import { NotificationApiService } from "src/notification/notification-api.service";
import { ExtendedPrismaClient } from "src/prisma.extension";
import { QRCodeService } from "src/qrcode/qrcode.service";
import { ReadQRCodeDto } from "../dto/qrcode.dto";

export class QrCodeSiswaModulesService {
    constructor(
        private readonly qrCodeService: QRCodeService,
        @Inject('PrismaService') private prismaService: CustomPrismaService<ExtendedPrismaClient>,
        private readonly eventService: EventsGateway,
        private readonly notificationService: NotificationApiService

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

                    const siswa = await this.prismaService.client.siswa.findUniqueOrThrow({
                        where: {
                            id: parseInt(user.sub)
                        }
                    })

                    const gateway = await this.prismaService.client.gateways.findUniqueOrThrow({
                        where: {
                            token: decrypt.data.token
                        }
                    })

                    const presence = await this.eventService.handleHttpPresenceQr({
                        ip: gateway.ip,
                        token: gateway.token,
                        ref: siswa.id,
                    }, 'siswa')

                    return {
                        action: 'PRESENCE',
                        data: {
                            presenceId: presence ? (presence as any).id : null,
                        }
                    }

                // case 'WITHDRAW':

                case 'PAYMENT':
                    const paymentData = decrypt.data
                    const fromPayment = await this.prismaService.client.account.findFirst({
                        where: {
                            id: paymentData.fromAccountId,
                            accountableType: AccountableType.PEGAWAI
                        },
                    })

                    if (!fromPayment) throw new BadRequestException("Account not found")

                    const siswaAccount = await this.prismaService.client.account.findFirst({
                        where: {
                            accountableId: parseInt(user.sub),
                            accountableType: AccountableType.SISWA
                        }
                    })

                    if (!siswaAccount) throw new BadRequestException("Account not found")

                    if (siswaAccount.balance < paymentData.amount) throw new BadRequestException("Saldo tidak mencukupi")


                    const transaction = await this.prismaService.client.transactions.findUniqueOrThrow({
                        where: {
                            id: paymentData.transactionId,
                            fromAccountId: paymentData.fromAccountId,
                            fromAccountType: AccountableType.PEGAWAI,
                            type: 'PAYMENT',
                        }
                    });

                    if (!transaction) {
                        await this.eventService.sendNotificationEmitPayment(transaction.code, {}, 'failed')
                        throw new BadRequestException("Transaction not found")
                    }

                    if (transaction.status === 'SUCCESS') {
                        await this.eventService.sendNotificationEmitPayment(transaction.code, {}, 'failed')
                        throw new BadRequestException("Transaksi telah selesai")
                    }

                    const toPayment = await this.prismaService.client.transactions.update({
                        where: {
                            id: paymentData.transactionId,
                            fromAccountId: paymentData.fromAccountId,
                            fromAccountType: AccountableType.PEGAWAI,
                            type: 'PAYMENT',
                        },
                        data: {
                            toAccountId: siswaAccount.id,
                            toAccountType: AccountableType.SISWA,
                            status: 'SUCCESS',
                        }
                    });

                    if (!toPayment) {
                        await this.eventService.sendNotificationEmitPayment(transaction.code, {}, 'failed')
                        throw new BadRequestException("Transaction not found")
                    }
                    // update from account
                    const [fromPaymentUpdated, siswaAccountUpdated, createTransactionSiswa] = await Promise.all([
                        await this.prismaService.client.account.update({
                            where: {
                                id: paymentData.fromAccountId,
                            },
                            data: {
                                balance: fromPayment.balance + parseInt(paymentData.amount)
                            }
                        }),
                        await this.prismaService.client.account.update({
                            where: {
                                id: siswaAccount.id
                            },
                            data: {
                                balance: siswaAccount.balance - parseInt(paymentData.amount)
                            }
                        }),
                        await this.prismaService.client.transactions.create({
                            data: {
                                title: "Pembayaran",
                                amount: paymentData.amount,
                                code: paymentData.code,
                                flow: 'DOWN',
                                payment_method: 'CASH',
                                toAccountId: paymentData.fromAccountId,
                                toAccountType: AccountableType.PEGAWAI,
                                fromAccountId: siswaAccount.id,
                                fromAccountType: AccountableType.SISWA,
                                type: 'PAYMENT',
                                status: 'SUCCESS',
                            }
                        })
                    ])

                    if (!fromPaymentUpdated || !siswaAccountUpdated || !createTransactionSiswa) {
                        await this.eventService.sendNotificationEmitPayment(toPayment.code, {}, 'failed')
                        throw new BadRequestException("Gagal melakukan transaksi")
                    }

                    // if (siswa) {
                    //     console.log('siswa', siswa);
                    //     try {
                    //         await this.notificationService.sendPushNotification({
                    //             title: "Transfer",
                    //             body: `Pembayaran sebesar ${rupiahFormat(toPayment.amount)}`,
                    //             token: siswa.fcm_token,
                    //             ref_id: siswa.id,
                    //             user_type: "SISWA",
                    //             type: 'TRANSACTION',
                    //             data: toPayment,
                    //             visual_type: "success"
                    //         })
                    //     } catch { }
                    // }

                    await this.eventService.sendNotificationEmitPayment(toPayment.code, toPayment, 'success')

                    return {
                        action: 'PAYMENT',
                        data: {
                            transactionId: toPayment.id,
                        }
                    }
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