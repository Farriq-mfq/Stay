import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { account } from "@prisma/client";
import { CustomPrismaService } from "nestjs-prisma";
import { ExtendedPrismaClient } from "src/prisma.extension";
import { v4 as uuidv4 } from 'uuid';
import { DepositTransactionDto, PaymentMethodType, PaymentTransactionDto, TransferTransactionDto } from "./dto/transaction.dto";
@Injectable()
export class TransactionService {
    constructor(
        @Inject('PrismaService') private prismaService: CustomPrismaService<ExtendedPrismaClient>,
    ) { }

    async Deposit(from: account, to: account, paymentMethod: PaymentMethodType, depositTransactionDto: DepositTransactionDto) {
        const transcation = this.prismaService.client.$transaction(async (prisma) => {

            const account = await prisma.account.findUniqueOrThrow({
                where: {
                    id: to.id
                }
            })

            const updateAccount = await prisma.account.update({
                where: {
                    id: to.id
                },
                data: {
                    balance: account.balance + depositTransactionDto.amount
                }
            })

            if (!updateAccount) {
                throw new BadRequestException("Deposit failed")
            }

            await prisma.transactions.create({
                data: {
                    amount: depositTransactionDto.amount,
                    code: uuidv4(),
                    flow: 'UP',
                    payment_method: paymentMethod,
                    fromAccountId: from.id,
                    toAccountId: to.id,
                    status: 'SUCCESS',
                    type: "DEPOSIT",
                    title: `Deposit untuk ${to.name}`,
                    note: depositTransactionDto.note
                }
            })
        })

        return transcation;
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
            await prisma.transactions.create({
                data: {
                    amount: transferTransactionDto.amount,
                    code: uuidv4(),
                    flow: 'DOWN',
                    payment_method: paymentMethod,
                    fromAccountId: fromAccount.id,
                    toAccountId: toAccount.id,
                    status: 'SUCCESS',
                    type: "TRANSFER",
                    title: `Transfer untuk ${toAccount.name}`,
                    note: transferTransactionDto.note
                }
            })

        })
        return transcation;

    }


    async Payment(from: account, paymentMethod: PaymentMethodType, paymentTransactionDto: PaymentTransactionDto) {
        const transcation = this.prismaService.client.$transaction(async (prisma) => {

            const fromAccount = await prisma.account.findUniqueOrThrow({
                where: {
                    id: from.id
                }
            })

            const toAccount = await prisma.account.findUniqueOrThrow({
                where: {
                    id: paymentTransactionDto.toAccountId
                }
            })

            // update balance sender
            const updateSender = await prisma.account.update({
                where: {
                    id: fromAccount.id
                },
                data: {
                    balance: fromAccount.balance - paymentTransactionDto.amount
                }
            })

            if (!updateSender) {
                throw new BadRequestException("Payment failed")
            }

            // update balance receiver
            const updateReceiver = await prisma.account.update({
                where: {
                    id: paymentTransactionDto.toAccountId
                },
                data: {
                    balance: toAccount.balance + paymentTransactionDto.amount
                }
            })

            if (!updateReceiver) {
                throw new BadRequestException("Payment failed")
            }

            // create transaction
            await prisma.transactions.create({
                data: {
                    amount: paymentTransactionDto.amount,
                    code: uuidv4(),
                    flow: 'DOWN',
                    payment_method: paymentMethod,
                    fromAccountId: fromAccount.id,
                    toAccountId: toAccount.id,
                    status: 'SUCCESS',
                    type: "PAYMENT",
                    title: paymentTransactionDto.title,
                    note: paymentTransactionDto.note,
                    detail_transactions: {
                        createMany: {
                            data: paymentTransactionDto.details.map((detail) => ({
                                amount: detail.amount,
                                title: detail.title,
                                quantity: detail.quantity,
                                subtotal: detail.amount * detail.quantity
                            }))
                        }
                    }
                }
            })

        })

        return transcation
    }
}