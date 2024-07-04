import { Module } from '@nestjs/common';
import { SiswaController } from './siswa.controller';
import { SiswaService } from './siswa.service';
import { AccessTokenStrategySiswa } from './strategies/accessToken.strategy';
import { SiswaAuthController } from './auth/siswa.auth.controller';
import { SiswaAuthService } from './auth/siswa.auth.service';
import { RefreshTokenStrategySiswa } from './strategies/refreshToken.strategy';
@Module({
  controllers: [SiswaController, SiswaAuthController],
  providers: [SiswaService, SiswaAuthService, AccessTokenStrategySiswa, RefreshTokenStrategySiswa],
})
export class SiswaModule { }
