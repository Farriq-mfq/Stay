import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, BadRequestException, UseGuards } from '@nestjs/common';
import { ConnectedClientService } from './connected-client.service';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { PermissionGuard } from 'src/guards/permissions.guard';
import { Permissions } from 'src/decorators/permission.decorator';

@Controller('connected-client')
@UseGuards(AccessTokenGuard, PermissionGuard)
export class ConnectedClientController {
  constructor(private readonly connectedClientService: ConnectedClientService) { }

  @Get()
  @Permissions('client:read')
  async findAll() {
    return await this.connectedClientService.findAll();
  }
  
  @Post("set-session/:socketId/:sessionId")
  @Permissions('client:set-session')
  async setSession(@Param('socketId') socketId: string, @Param('sessionId', new ParseIntPipe({
    exceptionFactory(error) {
      throw new BadRequestException("Invalid session id");
    },
  })) sessionId: number) {
    if (!socketId) throw new BadRequestException("socketId is required");
    return await this.connectedClientService.setSession(socketId, sessionId);
  }
}
