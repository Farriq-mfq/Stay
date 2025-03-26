import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, UseGuards, ParseEnumPipe } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { ApiTags } from '@nestjs/swagger';
import { SessionRoleType } from '@prisma/client';
import { PermissionGuard } from 'src/guards/permissions.guard';
import { Permissions } from 'src/decorators/permission.decorator';

@Controller('sessions')
@ApiTags("Gateway")
@UseGuards(AccessTokenGuard, PermissionGuard)
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) { }

  @Post()
  @Permissions('sessions:create')
  create(@Body() createSessionDto: CreateSessionDto) {
    return this.sessionsService.create(createSessionDto);
  }

  @Get()
  @Permissions('sessions:read')
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('search') search?: string,
    @Query('role', new ParseEnumPipe(SessionRoleType, { optional: true })) role?: SessionRoleType
  ) {
    return this.sessionsService.findAll(page, limit, search, role);
  }

  @Get(':id')
  @Permissions('sessions:detail')
  findOne(@Param('id') id: string) {
    return this.sessionsService.findOne(+id);
  }

  @Patch(':id')
  @Permissions('sessions:update')
  update(@Param('id') id: string, @Body() updateSessionDto: UpdateSessionDto) {
    return this.sessionsService.update(+id, updateSessionDto);
  }

  @Delete(':id')
  @Permissions('sessions:delete')
  remove(@Param('id') id: string) {
    return this.sessionsService.remove(+id);
  }
}
