import { Inject, Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from 'src/prisma.extension';
@Injectable()
export class StatsService {
  constructor(
    @Inject('PrismaService') private prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {

  }

  async getAllStats(){
    const [
      gateways,
      sessions,
      siswa,
      users
    ] = await Promise.all([
      this.prismaService.client.gateways.count(),
      this.prismaService.client.presence_sessions.count(),
      this.prismaService.client.siswa.count(),
      this.prismaService.client.users.count(),
    ])

    return {
      gateways,
      sessions,
      siswa,
      users
    }
  }
}
