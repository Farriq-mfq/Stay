import { Module } from '@nestjs/common'
import { FirebaseModule } from 'src/firebase/firebase.module';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
@Module({
    imports: [FirebaseModule],
    providers: [NotificationService],
    exports: [NotificationService],
    controllers: [NotificationController]
})
export class NotificationModule {

}