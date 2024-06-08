import { Module } from '@nestjs/common';
import { GatewaysService } from './gateways.service';
import { GatewaysController } from './gateways.controller';
import { TokenService } from 'src/services/token.service';

@Module({
  controllers: [GatewaysController],
  providers: [GatewaysService, TokenService],
})
export class GatewaysModule { }
