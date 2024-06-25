import { Inject, Injectable } from '@nestjs/common';
import { hash } from 'argon2';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from 'src/prisma.extension';
import { UpdateUserDto, UpdateUserPasswordDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
export class UsersService {
  constructor(
    @Inject('PrismaService') private prismaService: CustomPrismaService<ExtendedPrismaClient>,

  ) {

  }
  async findByUsername(
    username: string
  ) {
    return await this.prismaService.client.users.findUnique({
      where: {
        username
      }
    })
  }

  async find(id: string) {
    return await this.prismaService.client.users.findUnique({
      where: {
        id: parseInt(id)
      },
      select:{
        id: true,
        name: true,
        username: true,
        role: true,
        refreshToken: true, 
        createdAt: true,
        updatedAt: true,
      }
    })
  }
  async findDetail(id: string) {
    return await this.prismaService.client.users.findUnique({
      where: {
        id: parseInt(id)
      },
    })
  }


  async updateToken(id: string, token: string | null) {
    await this.prismaService.client.users.update({
      where: {
        id: parseInt(id)
      },
      data: {
        refreshToken: token != null ? await hash(token) : token
      }
    })
  }

  async findAllUsers(
    page?: number,
    limit?: number,
    search?: string,
  ) {
    const [items, meta] = await this.prismaService.client.users.paginate({
      where: {
        ...search && {
          OR: [
            {
              name: {
                contains: search,
                mode: 'insensitive'
              }
            }
          ]
        },
        role: 'user'
      }
    }).withPages({
      limit: limit ?? 10,
      includePageCount: true,
      page: page ?? 1
    })

    return {
      items,
      meta
    }
  }

  async remove(id: number) {
    return await this.prismaService.client.users.delete({
      where: {
        id
      }
    })
  }
  async create(CreateUserDto: CreateUserDto) {
    return await this.prismaService.client.users.create({
      data: {
        name: CreateUserDto.name,
        username: CreateUserDto.username,
        password: await hash(CreateUserDto.password),
        role: 'user'
      }
    })
  }
  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.prismaService.client.users.update({
      where: {
        id: id,
        role: 'user'
      },
      data: {
        name: updateUserDto.name,
        username: updateUserDto.username,
      },
    })
  }
  async updatePassword(id: number, updateUserPasswordDto: UpdateUserPasswordDto) {
    return await this.prismaService.client.users.update({
      where: {
        id: id,
        role: 'user'
      },
      data: {
        password: await hash(updateUserPasswordDto.password),
      },
    })
  }
}
