import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { NotificationApiService } from 'src/notification/notification-api.service';
@Module({
    providers: [TransactionService, NotificationApiService],
    controllers: [TransactionController],
    exports: [TransactionService, NotificationApiService]
})
export class TransactionModule {

}