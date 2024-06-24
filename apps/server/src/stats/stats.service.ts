import { Inject, Injectable } from '@nestjs/common';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from 'src/prisma.extension';
import { months } from 'src/utils/getMonth';
@Injectable()
export class StatsService {
  constructor(
    @Inject('PrismaService') private prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {

  }

  async getAllStats() {
    const [
      gateways,
      sessions,
      siswa,
      users
    ] = await Promise.all([
      this.prismaService.client.gateways.count(),
      this.prismaService.client.presence_sessions.count(),
      this.prismaService.client.siswa.count(),
      this.prismaService.client.users.count({
        where: {
          role: 'user'
        }
      }),
    ])

    return {
      gateways,
      sessions,
      siswa,
      users
    }
  }

  async getChartPresences() {
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(`${currentYear}-01-01T00:00:00.000Z`);
    const endOfYear = new Date(`${currentYear}-12-31T23:59:59.999Z`);

    const dataPresences = await this.prismaService.client.presences.findMany({
      where: {
        createdAt: {
          gte: startOfYear,
          lte: endOfYear
        }
      }
    })
    const mappingMonth = months.map((month, index) => ({
      key: month,
      value: dataPresences.filter(data => {
        const formatedMonth = format(data.createdAt, 'M', {
          locale: id
        })
        return (index + 1) === parseInt(formatedMonth)
      }).length
    }))

    return mappingMonth
  }
}
