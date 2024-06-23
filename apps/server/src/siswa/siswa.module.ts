import { Module } from '@nestjs/common';
import { AccessTokenStrategy } from 'src/auth/accessToken.strategy';
import { RefreshTokenStrategy } from 'src/auth/refreshToken.strategy';
import { SiswaController } from './siswa.controller';
import { SiswaService } from './siswa.service';
@Module({
  controllers: [SiswaController],
  providers: [SiswaService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class SiswaModule { }
