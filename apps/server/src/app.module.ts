import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { GatewaysModule } from './gateways/gateways.module';
import { SiswaModule } from './siswa/siswa.module';
import { TelegramModule } from './telegram/telegram.module';
import { UsersModule } from './users/users.module';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { CustomPrismaModule } from 'nestjs-prisma';
import { EventsModule } from './events/events.module';
import { PresenceModule } from './presence/presence.module';
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
    ConfigModule.forRoot({
      isGlobal: true
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    EventsModule,
    AuthModule,
    UsersModule,
    SiswaModule,
    TelegramModule,
    GatewaysModule,
    PresenceModule,
  ],
})
export class AppModule { }
