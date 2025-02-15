import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { format } from 'date-fns';
import { Response } from 'express';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { CreatePresenceByManual, CreatePresenceByQRDTO } from './dto/create-presence.dto';
import { PresenceService } from './presence.service';

@Controller('presence')
@ApiTags("Presence")
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
    @Query("date") date?: string
  ) {
    const buffer = await this.presenceService.exportData(
      sessionId,
      search,
      date
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
    @Query("date") date?: string
  ) {

    return await this.presenceService.findAll(
      sessionId,
      page,
      limit,
      search,
      date
    )
  }
  @Get('/:sessionId/daily')
  @UseGuards(AccessTokenGuard)
  async findAllByDaily(
    @Param('sessionId', new ParseIntPipe()) sessionId: string,
    @Query("date") date: string,
    @Query('search') search?: string,
    @Query('rombel') rombel?: string
  ) {

    return await this.presenceService.findAllByDaily(
      sessionId,
      search,
      date,
      rombel
    )
  }

  @Get('/export/:sessionId/daily')
  @UseGuards(AccessTokenGuard)
  async exportPresenceByRombel(
    @Res() res: Response,
    @Param('sessionId', new ParseIntPipe()) sessionId: string,
    @Query("date") date: string,
    @Query('search') search?: string,
    @Query('rombel') rombel?: string
  ) {

    if (rombel != null && rombel != undefined && rombel != '') {
      res.set({
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename=${format(new Date(), 'yyyy-MM-dd')}-presences.xlsx`,
      });
    } else {
      res.set({
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename=${format(new Date(), 'yyyy-MM-dd')}-files.zip`,
      })
    }

    const buffer = await this.presenceService.exportByDaily(
      sessionId,
      search,
      date,
      rombel,
    )


    res.send(buffer);
  }
  @Get('/:sessionId/:rombel/monthly')
  @UseGuards(AccessTokenGuard)
  async findAllPresenceByMonthClass(
    @Param('sessionId', new ParseIntPipe()) sessionId: string,
    @Query("date") date: string,
    @Param('rombel') rombel?: string
  ) {

    return await this.presenceService.findAllPresenceByMonthClass(
      sessionId,
      date,
      rombel
    )
  }
  @Get('/:sessionId/:rombel/monthly/export')
  @UseGuards(AccessTokenGuard)
  async exportPresenceByMonthClass(
    @Res() res: Response,
    @Param('sessionId', new ParseIntPipe()) sessionId: string,
    @Query("date") date: string,
    @Param('rombel') rombel?: string,
  ) {

    const buffer = await this.presenceService.exportPresenceByMonthClass(
      sessionId,
      date,
      rombel)
    res.send(buffer)
    // res.set({
    //   'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    //   'Content-Disposition': `attachment; filename=${format(new Date(), 'yyyy-MM-dd')}-presences.xlsx`,
    // });
    // res.send(buffer);
  }
}
