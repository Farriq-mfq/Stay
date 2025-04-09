import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { AccountableType } from "@prisma/client";
import { format } from "date-fns";
import { CustomPrismaService } from "nestjs-prisma";
import { ExtendedPrismaClient } from "src/prisma.extension";
import { CreateWithdrawDto } from "../dto/transaction.dto";
import { QRCodeService } from "src/qrcode/qrcode.service";
@Injectable()
export class TransactionPegawaiModuleService {
    constructor(
        @Inject('PrismaService') private prismaService: CustomPrismaService<ExtendedPrismaClient>,
        private readonly qrcodeService: QRCodeService
    ) { }
    async listTransaction(user: any, limit: string, after: string, before: string, search: string) {
        if (!user) throw new UnauthorizedException()

        const userId = parseInt(user.sub)

        const account = await this.prismaService.client.account.findFirstOrThrow({
            where: {
                accountableId: userId,
                accountableType: AccountableType.PEGAWAI
            }
        })

        if (!account) throw new BadRequestException()

        const transactions = await this.prismaService.client.transactions.paginate({
            where: {
                fromAccountId: account.id,
                fromAccountType: AccountableType.PEGAWAI,
                ...search && {
                    OR: [
                        {
                            to: {
                                name: {
                                    contains: search,
                                    mode: 'insensitive'
                                }
                            }
                        },
                        {
                            from: {
                                name: {
                                    contains: search,
                                    mode: 'insensitive'
                                }
                            }
                        },
                    ]
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        }).withCursor({
            limit: 20,
            after: after ?? null,
            before: before ?? null,
        })

        const data = transactions[0];
        const createdAt = [...new Set(data.map((presence) => format(presence.createdAt, 'yyyy-MM-dd')))];


        const parseDatabyCreatedAt = createdAt.map((dt) => {
            return {
                "date": dt,
                'total': {
                    'in': data.filter((transaction) => format(transaction.createdAt, 'yyyy-MM-dd') === dt && transaction.flow === 'UP').reduce((total, transaction) => total + transaction.amount, 0),
                    'out': Math.abs(data.filter((transaction) => format(transaction.createdAt, 'yyyy-MM-dd') === dt && transaction.flow === 'DOWN').reduce((total, transaction) => total - transaction.amount, 0)),
                },
                "transactions": data.filter((transaction) => format(transaction.createdAt, 'yyyy-MM-dd') === dt)
            }
        })
        return [
            parseDatabyCreatedAt,
            transactions[1]
        ]
    }

    async findTransaction(user: any, id: number) {
        if (!user) throw new UnauthorizedException();
        const account = await this.prismaService.client.account.findFirstOrThrow({
            where: {
                accountableId: parseInt(user.sub),
                accountableType: AccountableType.PEGAWAI
            }
        })
        return await this.prismaService.client.transactions.findUniqueOrThrow({
            where: {
                id,
                fromAccountId: account.id,
            },
            include: {
                to: true,
                detail_transactions: true
            }
        })
    }
    async createWithdrawTransaction(user: any, body: CreateWithdrawDto) {
        return await this.prismaService.client.$transaction(async (prisma) => {
            const account = await prisma.account.findFirstOrThrow({
                where: {
                    accountableId: parseInt(user.sub),
                    accountableType: AccountableType.PEGAWAI
                }
            })

            if (!account) throw new BadRequestException()

            if (account.balance < body.amount) {
                throw new BadRequestException("Saldo tidak cukup")
            }

            const transaction = await prisma.transactions.create({
                data: {
                    title: "Menunggu Verifikasi Admin",
                    amount: body.amount,
                    code: `WD-${account.id}-${format(new Date(), 'yyyyMMddHHmmss')}`,
                    flow: 'DOWN',
                    payment_method: 'CASH',
                    fromAccountId: account.id,
                    fromAccountType: AccountableType.PEGAWAI,
                    type: 'WITHDRAW',
                    status: 'PENDING',
                }
            })
            const dataQrCode = {
                transactionId: transaction.id,
                amount: transaction.amount,
                code: transaction.code,
                timestamp: Date.now()
            }
            const qrcode = await this.qrcodeService.createQrCode(dataQrCode, 'WITHDRAW')
            return {
                transaction,
                qrcode
            }
        })
    }


    async listTransactionWithdraw(user: any, limit: string, after: string, before: string, search: string) {
        if (!user) throw new UnauthorizedException()

        const userId = parseInt(user.sub)

        const account = await this.prismaService.client.account.findFirstOrThrow({
            where: {
                accountableId: userId,
                accountableType: AccountableType.PEGAWAI
            }
        })

        if (!account) throw new BadRequestException()

        const transactions = await this.prismaService.client.transactions.paginate({
            where: {
                fromAccountId: account.id,
                fromAccountType: AccountableType.PEGAWAI,
                type: 'WITHDRAW',
                ...search && {
                    OR: [
                        {
                            to: {
                                name: {
                                    contains: search,
                                    mode: 'insensitive'
                                }
                            }
                        },
                        {
                            from: {
                                name: {
                                    contains: search,
                                    mode: 'insensitive'
                                }
                            }
                        },
                    ]
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
        }).withCursor({
            limit: 20,
            after: after ?? null,
            before: before ?? null,
        })

        const data = transactions[0];


        const parseData = await Promise.all(data.map(async (dt) => {
            const dataQrCode = {
                transactionId: dt.id,
                amount: dt.amount,
                code: dt.code,
                timestamp: Date.now()
            }
            return {
                ...dt,
                qrcode: await this.qrcodeService.createQrCode(dataQrCode, 'WITHDRAW')
            }
        }))

        return [
            parseData,
            transactions[1]
        ]
    }
}