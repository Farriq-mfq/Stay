import { Module } from '@nestjs/common';
import { AccessTokenStrategy } from 'src/auth/accessToken.strategy';
import { RefreshTokenStrategy } from 'src/auth/refreshToken.strategy';
import { PresenceModule } from 'src/presence/presence.module';
import { PresenceService } from 'src/presence/presence.service';
import { TokenService } from 'src/services/token.service';
import { GatewaysController } from './gateways.controller';
import { GatewaysService } from './gateways.service';

@Module({
  imports: [PresenceModule],
  controllers: [GatewaysController],
  providers: [GatewaysService, TokenService, PresenceService, AccessTokenStrategy, RefreshTokenStrategy],
  exports: [GatewaysService, TokenService, PresenceService]
})
export class GatewaysModule { }
