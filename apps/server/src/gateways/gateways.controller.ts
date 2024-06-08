import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Res } from '@nestjs/common';
import { CreateGatewayDto } from './dto/create-gateway.dto';
import { UpdateGatewayDto } from './dto/update-gateway.dto';
import { GatewaysService } from './gateways.service';
import { Response } from 'express';
@Controller('gateways')
export class GatewaysController {
  constructor(private readonly gatewaysService: GatewaysService) { }

  @Post()
  create(@Body() createGatewayDto: CreateGatewayDto) {
    return this.gatewaysService.create(createGatewayDto);
  }

  @Get()
  async findAll() {
    return await this.gatewaysService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gatewaysService.findOne(+id);
  }

  @Post(':id/ping')
  async ping(@Param('id', new ParseIntPipe()) id: string, @Res() res: Response) {
    const result = await this.gatewaysService.checkPing(+id)
    if (result.status === 'live') {
      return res.status(200).json(result)
    } else {
      return res.status(408).json(result)
    }
  }

  @Patch(':id')
  update(@Param('id', new ParseIntPipe()) id: string, @Body() updateGatewayDto: UpdateGatewayDto) {
    return this.gatewaysService.update(+id, updateGatewayDto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseIntPipe()) id: string) {
    return this.gatewaysService.remove(+id);
  }
}
