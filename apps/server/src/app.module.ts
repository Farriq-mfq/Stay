import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PresensiModule } from './presensi/presensi.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SiswaModule } from './siswa/siswa.module';
import { TelegramModule } from './telegram/telegram.module';
import { GatewayModule } from './gateway/gateway.module';

@Module({
  imports: [PresensiModule, AuthModule, UsersModule, SiswaModule, TelegramModule, GatewayModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
