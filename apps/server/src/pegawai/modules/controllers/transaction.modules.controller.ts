import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { TransactionPegawaiModuleService } from '../services/transactions.modules.service';
import { Request } from 'express';
import { AccessTokenPegawaiGuard } from 'src/pegawai/guards/accessTokenPegawai.guard';


@Controller('pegawai/modules/transaction')
@UseGuards(AccessTokenPegawaiGuard)
export class TransactionPegawaiModuleController {
    constructor(
        private readonly pegawaiModulesTransactionService: TransactionPegawaiModuleService
    ){}

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
}  