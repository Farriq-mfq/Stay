import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreatePresenceByQRDTO } from './dto/create-presence.dto';
import { PresenceService } from './presence.service';

@Controller('presence')
export class PresenceController {
  constructor(private readonly presenceService: PresenceService) { }

  @Post('/qr')
  async createPresenceByQR(@Body() CreatePresenceByQRDTO: CreatePresenceByQRDTO) {
    return this.presenceService.createPresenceByQR(CreatePresenceByQRDTO);
  }
}
