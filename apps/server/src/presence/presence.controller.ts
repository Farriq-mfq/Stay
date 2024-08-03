import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Res, UseGuards } from '@nestjs/common';
import { format } from 'date-fns';
import { Response } from 'express';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { CreatePresenceByQRDTO } from './dto/create-presence.dto';
import { PresenceService } from './presence.service';

@Controller('presence')
export class PresenceController {
  constructor(private readonly presenceService: PresenceService) { }

  @Post('/qr')
  @UseGuards(AccessTokenGuard)
  async createPresenceByQR(@Body() CreatePresenceByQRDTO: CreatePresenceByQRDTO) {
    // return await this.presenceService.createPresenceByQR(CreatePresenceByQRDTO);
    return {}
  }

  @Get('/export/:sessionId')
  @UseGuards(AccessTokenGuard)
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
      'Content-Disposition': `attachment; filename=${format(new Date(), 'yyyy-MM-dd')}-presences.xlsx`,
    });
    res.send(buffer);
  }
  @Get('/:sessionId/today')
  async findAllByToday(
    @Param('sessionId', new ParseIntPipe()) sessionId: string,
  ) {
    return await this.presenceService.findAllPresenceToday({
      sessionId
    })
  }
  @Get('/:sessionId')
  @UseGuards(AccessTokenGuard)
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
