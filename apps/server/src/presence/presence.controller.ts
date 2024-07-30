import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, Res, UseGuards } from '@nestjs/common';
import { CreatePresenceByQRDTO } from './dto/create-presence.dto';
import { PresenceService } from './presence.service';
import { Response } from 'express';
import { format } from 'date-fns';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';

@Controller('presence')
@UseGuards(AccessTokenGuard)
export class PresenceController {
  constructor(private readonly presenceService: PresenceService) { }

  @Post('/qr')
  async createPresenceByQR(@Body() CreatePresenceByQRDTO: CreatePresenceByQRDTO) {
    // return await this.presenceService.createPresenceByQR(CreatePresenceByQRDTO);
    return {}
  }

  @Get('/export/:sessionId')
  async export(
    @Res() res: Response,
    @Param('sessionId', new ParseIntPipe()) sessionId: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('search') search?: string,
  ) {
    const buffer = await this.presenceService.exportData(
      sessionId,
      search,
    )
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename=${format(new Date(),'yyyy-MM-dd')}-presences.xlsx`,
    });
    res.send(buffer);
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
