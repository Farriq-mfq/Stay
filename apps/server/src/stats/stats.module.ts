import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { SiswaModule } from 'src/siswa/siswa.module';
import { SiswaService } from 'src/siswa/siswa.service';

@Module({
  imports: [SiswaModule],
  controllers: [StatsController],
  providers: [StatsService, SiswaService],
})
export class StatsModule { }
