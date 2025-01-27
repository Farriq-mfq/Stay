import { Module } from '@nestjs/common';
import { PegawaiAuthController } from './auth/pegawai.auth.controller';
import { PegawaiAuthService } from './auth/pegawai.auth.service';
import { PegawaiController } from './pegawai.controller';
import { PegawaiService } from './pegawai.service';
import { AccessTokenStrategyPegawai } from './strategies/accessToken.strategy';
import { RefreshTokenStrategyPegawai } from './strategies/refreshToken.strategy';
@Module({
  controllers: [PegawaiController, PegawaiAuthController],
  providers: [PegawaiService, PegawaiAuthService, AccessTokenStrategyPegawai, RefreshTokenStrategyPegawai],
  exports: [PegawaiService]
})
export class PegawaiModule { }
