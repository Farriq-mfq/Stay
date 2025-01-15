import { Module } from '@nestjs/common';
import { PresenceController } from './presence.controller';
import { PresenceService } from './presence.service';
import { SiswaModule } from 'src/siswa/siswa.module';
import { SiswaService } from 'src/siswa/siswa.service';

@Module({
  imports: [SiswaModule],
  controllers: [PresenceController],
  providers: [PresenceService, SiswaService],
  exports: [PresenceService]
})
export class PresenceModule { }
