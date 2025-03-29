import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { AccountableType, siswa } from "@prisma/client";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CustomPrismaService } from "nestjs-prisma";
import { ExtendedPrismaClient } from "src/prisma.extension";
import { TransactionService } from "src/transaction/transaction.service";
import { formattedErrors } from "src/utils/error";
import { SearchAccountSiswaDto, TransferAccountSiswaDto } from "../dto/account.dto";
import { ROLE_CODE } from "src/config";

@Injectable()
export class SiswaAccountModuleService {
    constructor(
        @Inject('PrismaService') private prismaService: CustomPrismaService<ExtendedPrismaClient>,

        private readonly transactionService: TransactionService
    ) { }

    async myAccount(user: any) {
        if (!user) throw new UnauthorizedException()
        const userId = parseInt(user.sub)

        const account = await this.prismaService.client.account.findFirst({
            where: {
                accountableId: userId,
                accountableType: AccountableType.SISWA
            }
        })

        if (!account) throw new NotFoundException("Account not found")

        return account
    }

    async createAccount(user: any) {
        if (!user) throw new UnauthorizedException()
        const siswa = await this.prismaService.client.siswa.findUniqueOrThrow({
            where: {
                id: parseInt(user.sub)
            },
            include: {
                account: {
                    where: {
                        accountableType: AccountableType.SISWA
                    }
                }
            }
        })

        if (siswa.account) throw new BadRequestException("Account already created")

        const account = await this.prismaService.client.account.create({
            data: {
                name: siswa.name,
                accountNumber: this.generateAccountNumber(siswa),
                accountableType: AccountableType.SISWA,
                accountableId: siswa.id,
            }
        })

        await this.prismaService.client.siswa.update({
            where: {
                id: siswa.id
            },
            data: {
                accountId: account.id
            }
        })

        return account
    }


    protected generateAccountNumber(siswa: siswa) {
        const createYear = new Date(siswa.createdAt).getFullYear().toString().substring(2)
        const userId = siswa.id.toString()
        const checkDigit = userId.length

        return `${userId}${checkDigit}${createYear}${ROLE_CODE[AccountableType.SISWA]}`
    }

    async searchAccount(user: any, account_number: string) {
        if (!user) throw new UnauthorizedException()

        const dto = plainToInstance(SearchAccountSiswaDto, { account_number })
        const errors = await validate(dto)

        if (errors.length > 0) throw new BadRequestException(formattedErrors(errors))

        const myAccount = await this.prismaService.client.account.findFirst({
            where: {
                accountableId: parseInt(user.sub),
                accountableType: AccountableType.SISWA
            },
        });

        if (!myAccount) throw new BadRequestException("Please create account first")
        if (myAccount.accountNumber === account_number) throw new BadRequestException("Transfer to same account not allowed")

        const account = await this.prismaService.client.account.findUniqueOrThrow({
            where: {
                accountNumber: account_number,
                accountableId: {
                    not: parseInt(user.sub)
                },
                accountableType: {
                    not: AccountableType.PEGAWAI // not allow transfer to pegawai
                }
            }
        })

        return account
    }


    async transfer(user: any, transferDto: TransferAccountSiswaDto) {
        if (!user) throw new UnauthorizedException()

        const fromAccount = await this.prismaService.client.account.findFirst({
            where: {
                accountableId: parseInt(user.sub),
                accountableType: AccountableType.SISWA
            },
        });
        if (!fromAccount) throw new BadRequestException("Account not found")


        const toAccount = await this.prismaService.client.account.findUniqueOrThrow({
            where: {
                accountNumber: transferDto.account_number,
            }
        })


        if (fromAccount.accountNumber === toAccount.accountNumber) throw new BadRequestException("Transfer to same account not allowed")


        return await this.transactionService.Transfer(fromAccount, "BALANCE", {
            toAccountId: toAccount.id,
            amount: transferDto.nominal,
            note: transferDto.note
        })



    }
}