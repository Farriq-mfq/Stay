import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { Permissions } from 'src/decorators/permission.decorator';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { PermissionGuard } from 'src/guards/permissions.guard';
import { CreateMeetingSessionDto } from './dto/create-meeting-session.dto';
import { UpdateMeetingSessionDto } from './dto/update-meeting-session.dto';
import { MeetingSessionService } from './meeting-session.service';

@Controller('meeting-session')
@UseGuards(AccessTokenGuard, PermissionGuard)
export class MeetingSessionController {
  constructor(private readonly meetingSessionService: MeetingSessionService) { }

  @Post()
  @Permissions('meeting-session:create')
  async create(@Body() createMeetingSessionDto: CreateMeetingSessionDto) {
    return await this.meetingSessionService.create(createMeetingSessionDto);
  }

  @Post(':id/selected/:sessionid')
  @Permissions('meeting-session:select')
  async selectedMeetingSession(@Param('id', new ParseIntPipe()) id: number, @Param('sessionid', new ParseIntPipe()) sessionId: number) {
    return await this.meetingSessionService.selectedMeetingSession(sessionId, id);
  }
  @Post(':id/unselected/:sessionid')
  @Permissions('meeting-session:unselect')
  async unSelectedMeetingSession(@Param('id', new ParseIntPipe()) id: number, @Param('sessionid', new ParseIntPipe()) sessionId: number) {
    return await this.meetingSessionService.unSelectedMeetingSession(sessionId, id);
  }

  @Get()
  @Permissions('meeting-session:read')
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('search') search?: string,
  ) {
    return await this.meetingSessionService.findAll(page, limit, search);
  }

  @Get(':id')
  @Permissions('meeting-session:detail')
  async findOne(@Param('id') id: string) {
    return await this.meetingSessionService.findOne(+id);
  }

  @Patch(':id')
  @Permissions('meeting-session:update')
  async update(@Param('id') id: string, @Body() updateMeetingSessionDto: UpdateMeetingSessionDto) {
    return await this.meetingSessionService.update(+id, updateMeetingSessionDto);
  }

  @Delete(':id')
  @Permissions('meeting-session:delete')
  async remove(@Param('id') id: string) {
    return await this.meetingSessionService.remove(+id);
  }


}
