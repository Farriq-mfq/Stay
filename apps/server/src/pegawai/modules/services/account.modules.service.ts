import { BadRequestException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { AccountableType, pegawai } from "@prisma/client";
import { CustomPrismaService } from "nestjs-prisma";
import { ExtendedPrismaClient } from "src/prisma.extension";
import { SearchAccountPegawaiDto, TransferAccountPegawaiDto } from "../dto/account.dto";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { formattedErrors } from "src/utils/error";
import { TransactionService } from "src/transaction/transaction.service";

@Injectable()
export class PegawaiAccountModuleService {
    constructor(
        @Inject('PrismaService') private prismaService: CustomPrismaService<ExtendedPrismaClient>,

        private readonly transactionService: TransactionService
    ) { }

    async createAccount(user: any) {
        if (!user) throw new UnauthorizedException()
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

    async searchAccount(user: any, account_number: string) {
        if (!user) throw new UnauthorizedException()

        const dto = plainToInstance(SearchAccountPegawaiDto, { account_number })
        const errors = await validate(dto)

        if (errors.length > 0) throw new BadRequestException(formattedErrors(errors))

        const account = await this.prismaService.client.account.findUniqueOrThrow({
            where: {
                accountNumber: account_number,
                accountableId: {
                    not: parseInt(user.sub)
                }
            }
        })

        return account
    }


    async transfer(user: any, transferDto: TransferAccountPegawaiDto) {
        if (!user) throw new UnauthorizedException()

        const fromAccount = await this.prismaService.client.account.findFirst({
            where: {
                accountableId: parseInt(user.sub),
                accountableType: AccountableType.PEGAWAI
            },
        });
        if (!fromAccount) throw new BadRequestException("Account not found")


        const toAccount = await this.prismaService.client.account.findUniqueOrThrow({
            where: {
                accountNumber: transferDto.account_number,
            }
        })


        if (fromAccount.accountNumber === toAccount.accountNumber) throw new BadRequestException("Transfer to same account not allowed")


        return await this.transactionService.Transfer(fromAccount,"BALANCE",{
            toAccountId: toAccount.id,
            amount: transferDto.nominal,
            note: transferDto.note
        })



        // return await this.transactionService.Transfer()
    }
}