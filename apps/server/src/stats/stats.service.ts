import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { endOfMonth, format, isValid, parse, startOfMonth } from 'date-fns';
import { id } from 'date-fns/locale';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from 'src/prisma.extension';
import { SiswaService } from 'src/siswa/siswa.service';
import { months } from 'src/utils/getMonth';
import { validateAndFormatDateYear } from 'src/utils/helpers';
@Injectable()
export class StatsService {
  constructor(
    private readonly siswaService: SiswaService,
    @Inject('PrismaService') private prismaService: CustomPrismaService<ExtendedPrismaClient>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {

  }

  async getAllStats() {
    const [
      gateways,
      sessions,
      siswa,
      users,
      pegawai
    ] = await Promise.all([
      this.prismaService.client.gateways.count(),
      this.prismaService.client.presence_sessions.count(),
      this.prismaService.client.siswa.count(),
      this.prismaService.client.users.count({
        where: {
          role: 'user'
        }
      }),
      this.prismaService.client.pegawai.count()
    ])

    return {
      gateways,
      sessions,
      siswa,
      users,
      pegawai
    }
  }

  async getChartPresences(sessionId: string, rombel: string, year?: string) {
    const session = await this.prismaService.client.presence_sessions.findUniqueOrThrow({
      where: {
        id: +sessionId
      }
    })
    const currentYear = year ?? new Date().getFullYear();
    if (currentYear === "" || currentYear === undefined) throw new BadRequestException("year cannot be empty")
    const parseYear = parse(`${currentYear}`, 'yyyy', new Date());
    if (!isValid(parseYear)) throw new BadRequestException("invalid year format");


    const rombels = await this.siswaService.getGroupClass();

    const startOfYear = new Date(`${currentYear}-01-01T00:00:00.000Z`);
    const endOfYear = new Date(`${currentYear}-12-31T23:59:59.999Z`);

    const dataPresences = await this.prismaService.client.presences.findMany({
      where: {
        createdAt: {
          gte: startOfYear,
          lte: endOfYear
        },
        presence_sessionsId: session.id,
        ...(rombel && rombels.includes(rombel) && {
          siswa: {
            rombel
          }
        })
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

    return {
      year: currentYear,
      stats: mappingMonth
    }
  }

  async getALlYearPresence(sessionId: string) {
    const session = await this.prismaService.client.presence_sessions.findUniqueOrThrow({
      where: {
        id: +sessionId
      }
    })
    const cacheKey = `getALlYearPresence-${session.id}`

    if (await this.cacheManager.get(cacheKey)) return await this.cacheManager.get(cacheKey)

    const dataPresences = await this.prismaService.client.presences.groupBy({
      by: ['createdAt'],
      where: {
        presence_sessionsId: session.id,
      },
      orderBy: {
        createdAt: "asc"
      },
    })

    const years = [...new Set(dataPresences.map(data => format(data.createdAt, 'yyyy', {
      locale: id
    })))]
    if (years.length > 0) await this.cacheManager.set(cacheKey, years)
    return years
  }

  async getStatsPresenceByRombel(sessionId: string, date: string) {
    const session = await this.prismaService.client.presence_sessions.findUniqueOrThrow({
      where: {
        id: +sessionId
      }
    })

    let startDate = null;
    let endDate = null;
    if (date) {
      const parseDateYearMonth = validateAndFormatDateYear(date);
      if (!parseDateYearMonth) {
        throw new BadRequestException("date invalid")
      }
      startDate = startOfMonth(new Date(parseInt(parseDateYearMonth.year), parseInt(parseDateYearMonth.month) - 1));
      endDate = endOfMonth(new Date(parseInt(parseDateYearMonth.year), parseInt(parseDateYearMonth.month) - 1));
    }

    const presences = await this.prismaService.client.presences.findMany({
      where: {
        ...(startDate && endDate && {
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        }),
        presence_sessionsId: session.id,
      },
      include: {
        siswa: {
          select: {
            rombel: true
          }
        }
      }
    })
    const rombels = await this.siswaService.getGroupClass();

    const mappingRombels = rombels.map(rombel => {
      return {
        key: rombel,
        value: presences.filter(data => data.siswa.rombel === rombel).length
      }
    })

    return {
      date: startDate && endDate ? date : null,
      stats: mappingRombels
    };
  }
}
