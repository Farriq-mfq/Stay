import { Module } from '@nestjs/common';
import { SiswaAuthController } from './auth/siswa.auth.controller';
import { SiswaAuthService } from './auth/siswa.auth.service';
import { SiswaController } from './siswa.controller';
import { SiswaService } from './siswa.service';
import { AccessTokenStrategySiswa } from './strategies/accessToken.strategy';
import { RefreshTokenStrategySiswa } from './strategies/refreshToken.strategy';
@Module({
  controllers: [SiswaController, SiswaAuthController],
  providers: [SiswaService, SiswaAuthService, AccessTokenStrategySiswa, RefreshTokenStrategySiswa],
  exports: [SiswaService]
})
export class SiswaModule { }
