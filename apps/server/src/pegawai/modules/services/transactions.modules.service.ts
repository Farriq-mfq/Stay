import { BadRequestException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { AccountableType } from "@prisma/client";
import { format } from "date-fns";
import { CustomPrismaService } from "nestjs-prisma";
import { ExtendedPrismaClient } from "src/prisma.extension";

@Injectable()
export class TransactionPegawaiModuleService {
    constructor(
        @Inject('PrismaService') private prismaService: CustomPrismaService<ExtendedPrismaClient>,
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
                fromAccountType: AccountableType.PEGAWAI
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
}