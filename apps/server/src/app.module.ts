import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { CustomPrismaModule } from 'nestjs-prisma';
import { AuthModule } from './auth/auth.module';
import configuration from './config/configuration';
import { EventsModule } from './events/events.module';
import { GatewaysModule } from './gateways/gateways.module';
import { PresenceModule } from './presence/presence.module';
import { extendedPrismaClient } from './prisma.extension';
import { SessionsModule } from './sessions/sessions.module';
import { SiswaModule } from './siswa/siswa.module';
import { StatsModule } from './stats/stats.module';
import { UsersModule } from './users/users.module';
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
      isGlobal: true,
      load: [configuration]
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
    // AppChannel1Module,
    EventsModule,
    AuthModule,
    UsersModule,
    SiswaModule,
    GatewaysModule,
    PresenceModule,
    SessionsModule,
    StatsModule,
    // WhatsappModule,
  ],
})
export class AppModule { }
