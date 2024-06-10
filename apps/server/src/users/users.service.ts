import { Inject, Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from 'src/prisma.extension';
export class UsersService {
  constructor(
    @Inject('PrismaService') private prismaService: CustomPrismaService<ExtendedPrismaClient>,

  ) {

  }
  findByUsername(
    username: string
  ) {
    return this.prismaService.client.users.findUnique({
      where: {
        username
      }
    })
  }

  async updateToken(id: string, token: string | null) {
    await this.prismaService.client.users.update({
      where: {
        id: parseInt(id)
      },
      data: {
        refreshToken: token
      }
    })
  }
}
