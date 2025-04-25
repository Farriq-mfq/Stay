import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { EventsModule } from 'src/events/events.module';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { NotificationController } from './notification.controller';
import { NotificationProcessor } from './notification.processor';
import { NotificationService } from './notification.service';
import { NotificationApiService } from './notification-api.service';
@Module({
    imports: [FirebaseModule, EventsModule, BullModule.registerQueue({ name: 'notification-queue' })],
    providers: [NotificationService, NotificationApiService, NotificationProcessor],
    controllers: [NotificationController]
})
export class NotificationModule {

}