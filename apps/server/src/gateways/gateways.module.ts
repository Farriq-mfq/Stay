import { Module } from '@nestjs/common';
import { TokenService } from 'src/services/token.service';
import { GatewaysController } from './gateways.controller';
import { GatewaysService } from './gateways.service';
import { PresenceModule } from 'src/presence/presence.module';
import { PresenceService } from 'src/presence/presence.service';

@Module({
  imports: [PresenceModule],
  controllers: [GatewaysController],
  providers: [GatewaysService, TokenService, PresenceService],
  exports: [GatewaysService, TokenService]
})
export class GatewaysModule { }
