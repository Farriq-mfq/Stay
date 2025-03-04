import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';

@Controller('stats')
@UseGuards(AccessTokenGuard)
export class StatsController {
  constructor(private readonly statsService: StatsService) { }
  @Get('/')
  async getAllStats() {
    return await this.statsService.getAllStats();
  }

  @Get('/presences/chart/:sessionId')
  async getChartPresences(
    @Param('sessionId') sessionId: string,
    @Query('rombel') rombel?: string,
    @Query('year') year?: string
  ) {
    return await this.statsService.getChartPresences(sessionId, rombel, year);
  }
  @Get('/presences/years/:sessionId')
  async getALlYearPresence(
    @Param('sessionId') sessionId: string,
  ) {
    return await this.statsService.getALlYearPresence(sessionId);
  }

  @Get('/presences/rombel/:sessionId')
  async getStatsPresenceByRombel(
    @Param('sessionId') sessionId: string,
    @Query('date') date?: string
  ) {
    return await this.statsService.getStatsPresenceByRombel(sessionId, date);
  }
}
