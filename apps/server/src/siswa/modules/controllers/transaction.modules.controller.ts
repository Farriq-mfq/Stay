import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AccessTokenSiswaGuard } from 'src/siswa/guards/accessTokenSiswa.guard';
import { TransactionSiswaModuleService } from '../services/transactions.modules.service';
import { CreateWithdrawDto } from '../dto/transaction.dto';

@Controller('siswa/modules/transaction')
@UseGuards(AccessTokenSiswaGuard)
export class TransactionSiswaModuleController {
    constructor(
        private readonly siswaTransactionModule: TransactionSiswaModuleService
    ) { }

    @Get('/withdraw')
    async listTransactionWithdraw(
        @Req() req: Request,
        @Query('limit') limit?: string,
        @Query('before') before?: string,
        @Query('after') after?: string,
        @Query('search') search?: string,
    ) {
        return await this.siswaTransactionModule.listTransactionWithdraw(req.user, limit, before, after, search);
    }

    @Get('/')
    async getTransaction(
        @Req() req: Request,
        @Query('limit') limit?: string,
        @Query('before') before?: string,
        @Query('after') after?: string,
        @Query('search') search?: string,
    ) {
        return await this.siswaTransactionModule.listTransaction(req.user, limit, after, before, search);
    }



    @Get('/:id')
    async findTransaction(
        @Req() req: Request,
        @Param('id', new ParseIntPipe()) id: number
    ) {
        return await this.siswaTransactionModule.findTransaction(req.user, id);
    }

    @Post('/withdraw')
    async createWithdraw(
        @Req() req: Request,
        @Body() body: CreateWithdrawDto
    ) {
        return await this.siswaTransactionModule.createWithdrawTransaction(req.user, body);
    }


}  