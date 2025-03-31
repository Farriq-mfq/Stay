import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { DepositTransactionDto } from "./dto/transaction.dto";
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
    // @Permissions('transaction:deposit')
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
}