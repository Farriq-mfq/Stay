import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { GatewaysModule } from './gateways/gateways.module';
import { SiswaModule } from './siswa/siswa.module';
import { TelegramModule } from './telegram/telegram.module';
import { UsersModule } from './users/users.module';

import { CustomPrismaModule } from 'nestjs-prisma';
import { extendedPrismaClient } from './prisma.extension';

@Module({
  imports: [
    CustomPrismaModule.forRootAsync({
      name: 'PrismaService',
      isGlobal: true,
      useFactory: () => {
        return extendedPrismaClient;
      },
    }),
    AuthModule,
    UsersModule,
    SiswaModule,
    TelegramModule,
    GatewaysModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
