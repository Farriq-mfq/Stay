import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { SiswaModule } from 'src/siswa/siswa.module';
import { SiswaService } from 'src/siswa/siswa.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [SiswaModule, CacheModule.register()],
  controllers: [StatsController],
  providers: [StatsService, SiswaService],
})
export class StatsModule { }
