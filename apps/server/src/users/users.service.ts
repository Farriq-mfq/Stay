import { Inject, Injectable } from '@nestjs/common';
import { hash } from 'argon2';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from 'src/prisma.extension';
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
}
