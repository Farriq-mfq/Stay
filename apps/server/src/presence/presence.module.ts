import { Module } from '@nestjs/common';
import { NotificationService } from 'src/notification/notification.service';
import { PresenceController } from './presence.controller';
import { PresenceService } from './presence.service';

@Module({
  controllers: [PresenceController],
  providers: [PresenceService, NotificationService],
  exports: [PresenceService]
})
export class PresenceModule { }
