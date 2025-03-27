import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { PermissionGuard } from 'src/guards/permissions.guard';
import { Permissions } from 'src/decorators/permission.decorator';

@Controller('roles')
@UseGuards(AccessTokenGuard, PermissionGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  @Post()
  @Permissions('roles:create')
  async create(@Body() createRoleDto: CreateRoleDto) {
    return await this.rolesService.create(createRoleDto);
  }

  @Get()
  @Permissions('roles:read')
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('search') search?: string,
  ) {
    return await this.rolesService.findAll(page, limit, search);
  }

  @Get('without-pagination')
  @Permissions('users:read')
  async findAllWithoutPagination(
  ) {
    return await this.rolesService.findAllWithoutPagination();
  }

  @Patch(':id')
  @Permissions('roles:update')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return await this.rolesService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  @Permissions('roles:delete')
  async remove(@Param('id') id: string) {
    return await this.rolesService.remove(+id);
  }


}
