import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { AccountableType } from "@prisma/client";
import { CustomPrismaService } from "nestjs-prisma";
import { ExtendedPrismaClient } from "src/prisma.extension";

@Injectable()
export class HomeModulesPegawaiService {
    constructor(
        @Inject('PrismaService') private prismaService: CustomPrismaService<ExtendedPrismaClient>,
    ) { }

    async getLatestPresence(user: any) {
        if (!user) throw new UnauthorizedException()
        const userId = parseInt(user.sub)
        return await this.prismaService.client.presences_pegawai.findMany({
            where: {
                pegawaiId: userId,
            },
            include: {
                session: true,
                gateway: {
                    select: {
                        location: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 5
        })
    }

    async getLatestTransaction(user: any) {
        if (!user) throw new UnauthorizedException()
        const userId = parseInt(user.sub)
        const account = await this.prismaService.client.account.findFirst({
            where: {
                accountableId: userId,
                accountableType: AccountableType.PEGAWAI
            }
        })

        if (!account) return []

        return await this.prismaService.client.transactions.findMany({
            where: {
                fromAccountId: account.id
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 5
        })
    }


}