import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { CreatePresenceByQRDTO } from './dto/create-presence.dto';
import { PresenceService } from './presence.service';

@Controller('presence')
export class PresenceController {
  constructor(private readonly presenceService: PresenceService) { }

  @Post('/qr')
  async createPresenceByQR(@Body() CreatePresenceByQRDTO: CreatePresenceByQRDTO) {
    return await this.presenceService.createPresenceByQR(CreatePresenceByQRDTO);
  }

  @Get('/:sessionId')
  async findAll(
    @Param('sessionId', new ParseIntPipe()) sessionId: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('search') search?: string,
  ) {
    return await this.presenceService.findAll(
      sessionId,
      page,
      limit,
      search,
    )
  }
}
