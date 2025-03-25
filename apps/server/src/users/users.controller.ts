import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { PermissionGuard } from 'src/guards/permissions.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdateUserPasswordDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { Permissions } from 'src/decorators/permission.decorator';
import { Request } from 'express';

@ApiTags("Users")
@Controller('users')
@UseGuards(AccessTokenGuard, PermissionGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('/')
  @Permissions('users:read')
  async findAll(
    @Req() req: Request,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('search') search?: string,
  ) {
    return await this.usersService.findAllUsers(req.user, page, limit, search)
  }

  @Post('/')
  @Permissions('users:create')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto)
  }

  @Patch('/password/:id')
  @Permissions('users:update-password')
  async updateUserPassowrd(
    @Param('id') id: string,
    @Body() updateUserPasswordDto: UpdateUserPasswordDto) {
    return await this.usersService.updatePassword(+id, updateUserPasswordDto)
  }

  @Patch('/:id')
  @Permissions('users:update')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(+id, updateUserDto)
  }

  @Delete('/:id')
  @Permissions('users:delete')
  async removeUser(
    @Param('id') id: string,

  ) {
    return await this.usersService.remove(+id)
  }
}
