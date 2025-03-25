import { Body, Controller, Delete, Get, Param, ParseEnumPipe, ParseIntPipe, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Permissions } from 'src/decorators/permission.decorator';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { PermissionGuard } from 'src/guards/permissions.guard';
import { CreateGatewayDto, RoleGatewayType } from './dto/create-gateway.dto';
import { UpdateGatewayDto } from './dto/update-gateway.dto';
import { GatewaysService } from './gateways.service';
@Controller('gateways')
@ApiTags("Gateway")
@UseGuards(AccessTokenGuard, PermissionGuard)
export class GatewaysController {
  constructor(private readonly gatewaysService: GatewaysService) { }

  @Post()
  @Permissions('gateways:create')
  create(@Body() createGatewayDto: CreateGatewayDto) {
    return this.gatewaysService.create(createGatewayDto);
  }

  @Get()
  @Permissions('gateways:read')
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('search') search?: string,
    @Query('role', new ParseEnumPipe(RoleGatewayType, { optional: true })) role?: RoleGatewayType
  ) {
    return await this.gatewaysService.findAll(page, limit, search, role);
  }

  @Get(':id')
  @Permissions('gateways:create')
  findOne(@Param('id') id: string) {
    return this.gatewaysService.findOne(+id);
  }

  @Post(':id/ping')
  @Permissions('gateways:ping')
  async ping(@Param('id', new ParseIntPipe()) id: string, @Res() res: Response) {
    const result = await this.gatewaysService.checkPing(+id)
    if (result.status === 'live') {
      return res.status(200).json(result)
    } else {
      return res.status(408).json(result)
    }
  }

  @Post(':id/token')
  @Permissions('gateways:token')
  async generateToken(@Param('id', new ParseIntPipe()) id: string) {
    return await this.gatewaysService.generateSecureToken(+id)
  }

  @Patch(':id')
  @Permissions('gateways:update')
  update(@Param('id', new ParseIntPipe()) id: string, @Body() updateGatewayDto: UpdateGatewayDto) {
    return this.gatewaysService.update(+id, updateGatewayDto);
  }

  @Delete(':id')
  @Permissions('gateways:delete')
  remove(@Param('id', new ParseIntPipe()) id: string) {
    return this.gatewaysService.remove(+id);
  }

  @Post(':id/qrcode')
  @Permissions('gateways:qrcode')
  async generateQrCode(@Param('id', new ParseIntPipe()) id: string) {
    return await this.gatewaysService.generateQrCode(+id)
  }
}
