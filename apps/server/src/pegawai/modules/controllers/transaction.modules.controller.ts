import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { TransactionPegawaiModuleService } from '../services/transactions.modules.service';
import { Request } from 'express';
import { AccessTokenPegawaiGuard } from 'src/pegawai/guards/accessTokenPegawai.guard';
import { CreateWithdrawDto } from '../dto/transaction.dto';


@Controller('pegawai/modules/transaction')
@UseGuards(AccessTokenPegawaiGuard)
export class TransactionPegawaiModuleController {
    constructor(
        private readonly pegawaiModulesTransactionService: TransactionPegawaiModuleService
    ) { }

    @Get('/withdraw')
    async listTransactionWithdraw(
        @Req() req: Request,
        @Query('limit') limit?: string,
        @Query('before') before?: string,
        @Query('after') after?: string,
        @Query('search') search?: string,
    ) {
        return await this.pegawaiModulesTransactionService.listTransactionWithdraw(req.user, limit, before, after, search);
    }

    @Get('/')
    async getTransaction(
        @Req() req: Request,
        @Query('limit') limit?: string,
        @Query('before') before?: string,
        @Query('after') after?: string,
        @Query('search') search?: string,
    ) {
        return await this.pegawaiModulesTransactionService.listTransaction(req.user, limit, after, before, search);
    }



    @Get('/:id')
    async findTransaction(
        @Req() req: Request,
        @Param('id', new ParseIntPipe()) id: number
    ) {
        return await this.pegawaiModulesTransactionService.findTransaction(req.user, id);
    }


    @Post('/withdraw')
    async createWithdraw(
        @Req() req: Request,
        @Body() body: CreateWithdrawDto
    ) {
        return await this.pegawaiModulesTransactionService.createWithdrawTransaction(req.user, body);
    }

}  