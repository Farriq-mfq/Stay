import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { account, AccountableType, users } from "@prisma/client";
import { CustomPrismaService } from "nestjs-prisma";
import { ROLE_CODE } from "src/config";
import { ExtendedPrismaClient } from "src/prisma.extension";
import { v4 as uuidv4 } from 'uuid';
import { DepositTransactionDto, PaymentMethodType, TransferTransactionDto } from "./dto/transaction.dto";
@Injectable()
export class TransactionService {
    constructor(
        @Inject('PrismaService') private prismaService: CustomPrismaService<ExtendedPrismaClient>,
    ) { }

    async deposit(from: string | number, depositTransactionDto: DepositTransactionDto) {
        const transaction = await this.prismaService.client.$transaction(async (prisma) => {
            const fromAccount = await prisma.account.findFirst({
                where: {
                    accountableId: +from,
                    accountableType: "USER"
                }
            })

            if (!fromAccount) throw new BadRequestException("Account not found")

            if (depositTransactionDto.toAccountType === 'USER' && depositTransactionDto.toAccountId === +from) {
                throw new BadRequestException("You can't deposit to yourself")
            }

            const toAccount = await prisma.account.findFirst({
                where: {
                    accountableId: +depositTransactionDto.toAccountId,
                    accountableType: depositTransactionDto.toAccountType
                }
            })

            if (!toAccount) throw new BadRequestException("SEARCH_ACCOUNT_FAILED")


            const toTransaction = await prisma.transactions.create({
                data: {
                    amount: depositTransactionDto.amount,
                    code: uuidv4().replace(/-/g, ''),
                    flow: 'DOWN',
                    payment_method: 'CASH',
                    fromAccountId: fromAccount.id,
                    toAccountId: toAccount.id,
                    status: 'SUCCESS',
                    type: "DEPOSIT",
                    title: `${toAccount.name}`,
                    fromAccountType: fromAccount.accountableType,
                    toAccountType: toAccount.accountableType,
                    note: depositTransactionDto.note
                }
            })



            const updateBalance = await prisma.account.update({
                where: {
                    id: toAccount.id
                },
                data: {
                    balance: toAccount.balance + depositTransactionDto.amount
                }
            })

            if (!updateBalance) {
                throw new BadRequestException("Deposit failed")
            }

            await prisma.transactions.create({
                data: {
                    amount: depositTransactionDto.amount,
                    code: uuidv4().replace(/-/g, ''),
                    flow: 'UP',
                    payment_method: 'CASH',
                    fromAccountId: toAccount.id,
                    toAccountId: fromAccount.id,
                    status: 'SUCCESS',
                    type: "DEPOSIT",
                    title: `${fromAccount.name}`,
                    fromAccountType: toAccount.accountableType,
                    toAccountType: fromAccount.accountableType,
                    note: depositTransactionDto.note
                }
            })

            return toTransaction
        })

        return transaction
    }

    async createAccountUser(userId: string) {
        const user = await this.prismaService.client.users.findUniqueOrThrow({
            where: {
                id: +userId
            }
        })
        const account = await this.prismaService.client.account.create({
            data: {
                name: user.name,
                accountNumber: this.generateAccountNumber(user),
                accountableId: user.id,
                accountableType: "USER"
            }
        })
        return account
    }


    protected generateAccountNumber(user: users) {
        const createYear = new Date(user.createdAt).getFullYear().toString().substring(2)
        const userId = user.id.toString()
        const checkDigit = userId.length

        return `${userId}${checkDigit}${createYear}${ROLE_CODE[AccountableType.USER]}`
    }

    async Transfer(from: account, paymentMethod: PaymentMethodType, transferTransactionDto: TransferTransactionDto) {
        const transcation = this.prismaService.client.$transaction(async (prisma) => {

            const fromAccount = await prisma.account.findUniqueOrThrow({
                where: {
                    id: from.id
                }
            })

            const toAccount = await prisma.account.findUniqueOrThrow({
                where: {
                    id: transferTransactionDto.toAccountId
                }
            })


            if (fromAccount.balance < transferTransactionDto.amount) {
                throw new BadRequestException("Saldo tidak cukup")
            }

            // update balance sender
            const updateSender = await prisma.account.update({
                where: {
                    id: fromAccount.id
                },
                data: {
                    balance: fromAccount.balance - transferTransactionDto.amount
                }
            })

            if (!updateSender) {
                throw new BadRequestException("Transfer gagal")
            }

            // update balance receiver
            const updateReceiver = await prisma.account.update({
                where: {
                    id: transferTransactionDto.toAccountId
                },
                data: {
                    balance: toAccount.balance + transferTransactionDto.amount
                }
            })

            if (!updateReceiver) {
                throw new BadRequestException("Transfer failed")
            }

            // create transaction
            const idTrasaction = uuidv4();
            // from account
            const fromTransaction = await prisma.transactions.create({
                data: {
                    amount: transferTransactionDto.amount,
                    code: idTrasaction,
                    flow: 'DOWN',
                    payment_method: paymentMethod,
                    fromAccountId: fromAccount.id,
                    toAccountId: toAccount.id,
                    status: 'SUCCESS',
                    type: "TRANSFER",
                    title: `${toAccount.name}`,
                    note: transferTransactionDto.note,
                    fromAccountType: fromAccount.accountableType,
                    toAccountType: toAccount.accountableType
                }
            })
            // to account
            await prisma.transactions.create({
                data: {
                    amount: transferTransactionDto.amount,
                    code: idTrasaction,
                    flow: 'UP',
                    payment_method: paymentMethod,
                    fromAccountId: toAccount.id,
                    toAccountId: fromAccount.id,
                    status: 'SUCCESS',
                    type: "TRANSFER",
                    title: `${fromAccount.name}`,
                    note: transferTransactionDto.note,
                    fromAccountType: toAccount.accountableType,
                    toAccountType: fromAccount.accountableType
                }
            })

            return fromTransaction
        })
        return transcation;

    }

    async searchWithdrawTransaction(transaction_code: string) {
        const transaction = await this.prismaService.client.transactions.findFirst({
            where: {
                code: transaction_code,
                type: "WITHDRAW",
                status: "PENDING",
            },
            include: {
                to: true, // source account
                from: true // process account
            }
        })

        if (!transaction) {
            throw new NotFoundException("Kode transaksi tidak ditemukan")
        }

        return transaction
    }

    async withdraw(userId: string, transaction_code: string) {
        const transaction = await this.prismaService.client.transactions.findFirst({
            where: {
                code: transaction_code,
                type: "WITHDRAW",
                status: "PENDING",
            }
        })

        if (!transaction) {
            throw new NotFoundException("Kode transaksi tidak ditemukan")
        }

        const account = await this.prismaService.client.account.findFirst({
            where: {
                accountableId: transaction.fromAccountId,
                accountableType: transaction.fromAccountType
            }
        })


        const toAccount = await this.prismaService.client.account.findFirst({
            where: {
                accountableId: +userId,
                accountableType: "USER"
            }
        })


        if (!account || !toAccount) {
            throw new NotFoundException("Akun tidak ditemukan")
        }

        if (account.balance < transaction.amount) {
            throw new BadRequestException("Saldo tidak cukup")
        }

        const updateAccount = await this.prismaService.client.account.update({
            where: {
                id: account.id,
                accountableType: account.accountableType
            },
            data: {
                balance: account.balance - transaction.amount
            }
        })

        if (!updateAccount) {
            throw new BadRequestException("Penarikan gagal")
        }

        return await this.prismaService.client.transactions.update({
            where: {
                id: transaction.id,
                fromAccountId: account.id,
                fromAccountType: account.accountableType
            },
            data: {
                title: "Penarikan berhasil",
                toAccountId: toAccount.id,
                toAccountType: toAccount.accountableType,
                status: "SUCCESS",
            }
        })
    }


    // async Payment(from: account, paymentMethod: PaymentMethodType, paymentTransactionDto: PaymentTransactionDto) {
    //     const transcation = this.prismaService.client.$transaction(async (prisma) => {

    //         const fromAccount = await prisma.account.findUniqueOrThrow({
    //             where: {
    //                 id: from.id
    //             }
    //         })

    //         const toAccount = await prisma.account.findUniqueOrThrow({
    //             where: {
    //                 id: paymentTransactionDto.toAccountId
    //             }
    //         })

    //         // update balance sender
    //         const updateSender = await prisma.account.update({
    //             where: {
    //                 id: fromAccount.id
    //             },
    //             data: {
    //                 balance: fromAccount.balance - paymentTransactionDto.amount
    //             }
    //         })

    //         if (!updateSender) {
    //             throw new BadRequestException("Payment failed")
    //         }

    //         // update balance receiver
    //         const updateReceiver = await prisma.account.update({
    //             where: {
    //                 id: paymentTransactionDto.toAccountId
    //             },
    //             data: {
    //                 balance: toAccount.balance + paymentTransactionDto.amount
    //             }
    //         })

    //         if (!updateReceiver) {
    //             throw new BadRequestException("Payment failed")
    //         }

    //         // create transaction
    //         await prisma.transactions.create({
    //             data: {
    //                 amount: paymentTransactionDto.amount,
    //                 code: uuidv4(),
    //                 flow: 'DOWN',
    //                 payment_method: paymentMethod,
    //                 fromAccountId: fromAccount.id,
    //                 toAccountId: toAccount.id,
    //                 status: 'SUCCESS',
    //                 type: "PAYMENT",
    //                 title: paymentTransactionDto.title,
    //                 note: paymentTransactionDto.note,
    //                 detail_transactions: {
    //                     createMany: {
    //                         data: paymentTransactionDto.details.map((detail) => ({
    //                             amount: detail.amount,
    //                             title: detail.title,
    //                             quantity: detail.quantity,
    //                             subtotal: detail.amount * detail.quantity
    //                         }))
    //                     }
    //                 }
    //             }
    //         })

    //     })

    //     return transcation
    // }
}