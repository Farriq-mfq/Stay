import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import { DepositTransactionDto, WithdrawTransactionDto } from "./dto/transaction.dto";
import { TransactionService } from "./transaction.service";
import { Request } from "express";
import { AccessTokenGuard } from "src/guards/accessToken.guard";
import { AccountGuard } from "src/guards/account.guard";
import { PermissionGuard } from "src/guards/permissions.guard";
import { Permissions } from "src/decorators/permission.decorator";

@Controller('transaction')
@UseGuards(AccessTokenGuard, PermissionGuard)
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) { }
    @Post('deposit')
    @UseGuards(AccountGuard)
    @Permissions('transaction:deposit')
    async deposit(
        @Req() req: Request,
        @Body() depositTransactionDto: DepositTransactionDto,
    ) {
        const user = req.user as any;
        return this.transactionService.deposit(user.sub, depositTransactionDto);
    }

    @Post('create-account')
    async createAccount(@Req() req: Request) {
        const user = req.user as any;
        return this.transactionService.createAccountUser(user.sub);
    }

    @Get('withdraw')
    @UseGuards(AccountGuard)
    @Permissions('transaction:withdraw')
    async searchWithdrawTransaction(@Query() withdrawTransactionDto: WithdrawTransactionDto) {
        return await this.transactionService.searchWithdrawTransaction(withdrawTransactionDto.transaction_code);
    }

    @Post('withdraw')
    @UseGuards(AccountGuard)
    @Permissions('transaction:withdraw')
    async withdraw(@Req() req: Request, @Body() withdrawTransactionDto: WithdrawTransactionDto) {
        const user = req.user as any;
        return await this.transactionService.withdraw(user.sub, withdrawTransactionDto.transaction_code);
    }
}