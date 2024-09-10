import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdateUserPasswordDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Users")
@Controller('users')
@UseGuards(AccessTokenGuard, RolesGuard)
@Roles('admin')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('/')
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('search') search?: string,
  ) {
    return await this.usersService.findAllUsers(page, limit, search)
  }

  @Post('/')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto)
  }

  @Patch('/password/:id')
  async updateUserPassowrd(
    @Param('id') id: string,
    @Body() updateUserPasswordDto: UpdateUserPasswordDto) {
    return await this.usersService.updatePassword(+id, updateUserPasswordDto)
  }

  @Patch('/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(+id, updateUserDto)
  }

  @Delete('/:id')
  async removeUser(
    @Param('id') id: string,

  ) {
    return await this.usersService.remove(+id)
  }
}
