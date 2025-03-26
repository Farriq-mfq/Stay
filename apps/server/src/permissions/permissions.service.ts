import { Inject, Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from 'src/prisma.extension';

@Injectable()
export class PermissionsService {
  constructor(
    @Inject("PrismaService") private prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) { }
  async findAll() {
    return await this.prismaService.client.permissions.findMany();
  }
}
