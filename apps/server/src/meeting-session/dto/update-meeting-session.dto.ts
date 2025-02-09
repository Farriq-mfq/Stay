import { PartialType } from '@nestjs/swagger';
import { CreateMeetingSessionDto } from './create-meeting-session.dto';

export class UpdateMeetingSessionDto extends PartialType(CreateMeetingSessionDto) {}
