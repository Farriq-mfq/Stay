import { Module } from '@nestjs/common';
import { TokenService } from 'src/services/token.service';
import { GatewaysController } from './gateways.controller';
import { GatewaysService } from './gateways.service';

@Module({
  controllers: [GatewaysController],
  providers: [GatewaysService, TokenService],
})
export class GatewaysModule { }
