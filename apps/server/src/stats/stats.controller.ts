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
    @Query('class') siswaClass?: string
  ) {
    return await this.statsService.getChartPresences(sessionId, siswaClass);
  }
}
