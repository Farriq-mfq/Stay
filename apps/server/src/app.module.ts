import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { GatewaysModule } from './gateways/gateways.module';
import { SiswaModule } from './siswa/siswa.module';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { CustomPrismaModule } from 'nestjs-prisma';
import { EventsModule } from './events/events.module';
import { PresenceModule } from './presence/presence.module';
import { extendedPrismaClient } from './prisma.extension';
import { SessionsModule } from './sessions/sessions.module';
import { StatsModule } from './stats/stats.module';
import { AppChannel1Module } from './telegram/channel1/app-channel1.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';
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
    // TelegrafModule.forRootAsync({
    //   botName: AppChannel1,
    //   useFactory: (configService: ConfigService) => {
    //     return ({
    //       token: configService.get<string>('TELEGRAM_BOT_TOKEN'),
    //       middlewares: [telegrafSessionMiddleware],
    //       include: [AppChannel1Module]
    //     })
    //   },
    //   inject: [ConfigService],
    // }),
    AppChannel1Module,
    EventsModule,
    AuthModule,
    UsersModule,
    SiswaModule,
    GatewaysModule,
    PresenceModule,
    SessionsModule,
    StatsModule,
    WhatsappModule,
  ],
})
export class AppModule { }
