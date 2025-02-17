import { Module } from '@nestjs/common';
import { ConnectedClientController } from './connected-client.controller';
import { ConnectedClientService } from './connected-client.service';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [EventsModule],
  controllers: [ConnectedClientController],
  providers: [ConnectedClientService],
})
export class ConnectedClientModule { }
