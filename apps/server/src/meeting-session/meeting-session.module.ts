import { Module } from '@nestjs/common';
import { MeetingSessionService } from './meeting-session.service';
import { MeetingSessionController } from './meeting-session.controller';

@Module({
  controllers: [MeetingSessionController],
  providers: [MeetingSessionService],
})
export class MeetingSessionModule {}
