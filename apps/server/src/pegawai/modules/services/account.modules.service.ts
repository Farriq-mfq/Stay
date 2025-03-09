import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { AccountableType, pegawai } from "@prisma/client";
import { CustomPrismaService } from "nestjs-prisma";
import { ExtendedPrismaClient } from "src/prisma.extension";

@Injectable()
export class PegawaiAccountModuleService {
    constructor(
        @Inject('PrismaService') private prismaService: CustomPrismaService<ExtendedPrismaClient>,
    ) { }

    async createAccount(user: any) {
        if (!user) return {}
        const pegawai = await this.prismaService.client.pegawai.findUniqueOrThrow({
            where: {
                id: parseInt(user.sub)
            },
            include: {
                account: {
                    where: {
                        accountableType: AccountableType.PEGAWAI
                    }
                }
            }
        })

        if (pegawai.account) throw new BadRequestException("Account already created")

        const account = await this.prismaService.client.account.create({
            data: {
                name: pegawai.name,
                accountNumber: this.generateAccountNumber(pegawai),
                accountableType: AccountableType.PEGAWAI,
                accountableId: pegawai.id,
            }
        })

        await this.prismaService.client.pegawai.update({
            where: {
                id: pegawai.id
            },
            data: {
                accountId: account.id
            }
        })

        return account
    }


    protected generateAccountNumber(pegawai: pegawai) {
        const createYear = new Date(pegawai.createdAt).getFullYear().toString().substring(2)
        const userId = pegawai.id.toString()
        const checkDigit = userId.length

        const ROLE_CODE = {
            "PEGAWAI": "01",
            "SISWA": "02",
            "USER": "03",
        }

        return `${userId}${checkDigit}${createYear}${ROLE_CODE[AccountableType.PEGAWAI]}`
    }
}