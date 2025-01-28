import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';
import { SiswaModule } from 'src/siswa/siswa.module';
import { PegawaiModule } from 'src/pegawai/pegawai.module';
import { SiswaService } from 'src/siswa/siswa.service';
import { PegawaiService } from 'src/pegawai/pegawai.service';

@Module({
  imports: [SiswaModule, PegawaiModule],
  controllers: [SessionsController],
  providers: [SessionsService, SiswaService, PegawaiService],

})
export class SessionsModule { }
