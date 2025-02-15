import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, UseGuards, ParseEnumPipe } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { ApiTags } from '@nestjs/swagger';
import { SessionRoleType } from '@prisma/client';

@Controller('sessions')
@ApiTags("Gateway")
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) { }

  @Post()
  @UseGuards(AccessTokenGuard)
  create(@Body() createSessionDto: CreateSessionDto) {
    return this.sessionsService.create(createSessionDto);
  }

  @Get()
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('search') search?: string,
    @Query('role', new ParseEnumPipe(SessionRoleType, { optional: true })) role?: SessionRoleType
  ) {
    return this.sessionsService.findAll(page, limit, search, role);
  }

  @Get(':id')
  @UseGuards(AccessTokenGuard)
  findOne(@Param('id') id: string) {
    return this.sessionsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  update(@Param('id') id: string, @Body() updateSessionDto: UpdateSessionDto) {
    return this.sessionsService.update(+id, updateSessionDto);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  remove(@Param('id') id: string) {
    return this.sessionsService.remove(+id);
  }
}
