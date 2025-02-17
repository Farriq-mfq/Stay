import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, BadRequestException, UseGuards } from '@nestjs/common';
import { ConnectedClientService } from './connected-client.service';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';

@Controller('connected-client')
@UseGuards(AccessTokenGuard)
export class ConnectedClientController {
  constructor(private readonly connectedClientService: ConnectedClientService) { }

  @Get()
  async findAll() {
    return await this.connectedClientService.findAll();
  }

  @Post("set-session/:socketId/:sessionId")
  async setSession(@Param('socketId') socketId: string, @Param('sessionId', new ParseIntPipe({
    exceptionFactory(error) {
      throw new BadRequestException("Invalid session id");
    },
  })) sessionId: number) {
    if (!socketId) throw new BadRequestException("socketId is required");
    return await this.connectedClientService.setSession(socketId, sessionId);
  }
}
