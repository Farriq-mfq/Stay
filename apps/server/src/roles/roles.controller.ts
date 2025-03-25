import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
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
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @Permissions('roles:read')
  findAll() {
    return this.rolesService.findAll();
  }

  @Patch(':id')
  @Permissions('roles:update')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  @Permissions('roles:delete')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }
}
