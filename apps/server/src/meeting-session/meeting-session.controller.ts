import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { MeetingSessionService } from './meeting-session.service';
import { CreateMeetingSessionDto } from './dto/create-meeting-session.dto';
import { UpdateMeetingSessionDto } from './dto/update-meeting-session.dto';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';

@Controller('meeting-session')
@UseGuards(AccessTokenGuard)
export class MeetingSessionController {
  constructor(private readonly meetingSessionService: MeetingSessionService) { }

  @Post()
  create(@Body() createMeetingSessionDto: CreateMeetingSessionDto) {
    return this.meetingSessionService.create(createMeetingSessionDto);
  }

  @Post(':id/selected/:sessionid')
  async selectedMeetingSession(@Param('id', new ParseIntPipe()) id: number, @Param('sessionid', new ParseIntPipe()) sessionId: number) {
    return await this.meetingSessionService.selectedMeetingSession(sessionId, id);
  }
  @Post(':id/unselected/:sessionid')
  async unSelectedMeetingSession(@Param('id', new ParseIntPipe()) id: number, @Param('sessionid', new ParseIntPipe()) sessionId: number) {
    return await this.meetingSessionService.unSelectedMeetingSession(sessionId, id);
  }

  @Get()
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('search') search?: string,
  ) {
    return await this.meetingSessionService.findAll(page, limit, search);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.meetingSessionService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateMeetingSessionDto: UpdateMeetingSessionDto) {
    return await this.meetingSessionService.update(+id, updateMeetingSessionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.meetingSessionService.remove(+id);
  }


}
