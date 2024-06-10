import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreatePresenceDto } from './dto/create-presence.dto';
import { PresenceService } from './presence.service';

@Controller('presence')
export class PresenceController {
  constructor(private readonly presenceService: PresenceService) {}

  @Post()
  create(@Body() createPresenceDto: CreatePresenceDto) {
    return this.presenceService.create(createPresenceDto);
  }

  @Get()
  findAll() {
    return this.presenceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.presenceService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.presenceService.remove(+id);
  }
}
