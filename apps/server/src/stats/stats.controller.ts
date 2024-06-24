import { Controller, Get, UseGuards } from '@nestjs/common';
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

  @Get('/presences/chart')
  async getChartPresences() {
    return await this.statsService.getChartPresences()
  }
}
