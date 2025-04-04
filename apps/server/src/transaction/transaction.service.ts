import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { account, AccountableType, users } from "@prisma/client";
import { CustomPrismaService } from "nestjs-prisma";
import { ExtendedPrismaClient } from "src/prisma.extension";
import { v4 as uuidv4 } from 'uuid';
import { DepositTransactionDto, PaymentMethodType, PaymentTransactionDto, TransferTransactionDto } from "./dto/transaction.dto";
import { ROLE_CODE } from "src/config";
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

            await prisma.transactions.create({
                data: {
                    amount: depositTransactionDto.amount,
                    code: uuidv4(),
                    flow: 'UP',
                    payment_method: 'CASH',
                    fromAccountId: fromAccount.id,
                    toAccountId: toAccount.id,
                    status: 'SUCCESS',
                    type: "DEPOSIT",
                    title: `Deposit untuk ${toAccount.name}`,
                    fromAccountType: fromAccount.accountableType,
                    toAccountType: toAccount.accountableType
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

            const toTransaction = await prisma.transactions.create({
                data: {
                    amount: depositTransactionDto.amount,
                    code: uuidv4(),
                    flow: 'DOWN',
                    payment_method: 'CASH',
                    fromAccountId: fromAccount.id,
                    toAccountId: toAccount.id,
                    status: 'SUCCESS',
                    type: "DEPOSIT",
                    title: `Deposit berhasil untuk ${toAccount.name}`,
                    fromAccountType: fromAccount.accountableType,
                    toAccountType: toAccount.accountableType,
                    note: depositTransactionDto.note
                }
            })

            await prisma.transactions.create({
                data: {
                    amount: depositTransactionDto.amount,
                    code: uuidv4(),
                    flow: 'UP',
                    payment_method: 'CASH',
                    fromAccountId: toAccount.id,
                    toAccountId: fromAccount.id,
                    status: 'SUCCESS',
                    type: "DEPOSIT",
                    title: `Deposit berhasil untuk ${toAccount.name}`,
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

    async withdraw(transaction_code: string) {

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
                throw new BadRequestException("Insufficient balance")
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
                throw new BadRequestException("Transfer failed")
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
                    title: `Kirim untuk ${toAccount.name}`,
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
                    type: "DEPOSIT",
                    title: `Mendapatkan dari ${fromAccount.name}`,
                    note: transferTransactionDto.note,
                    fromAccountType: toAccount.accountableType,
                    toAccountType: fromAccount.accountableType
                }
            })

            return fromTransaction
        })
        return transcation;

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