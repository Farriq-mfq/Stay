import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { hash } from 'argon2';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { readFileSync } from 'fs';
import { CustomPrismaService } from 'nestjs-prisma';
import { join } from 'path';
import { ExtendedPrismaClient } from 'src/prisma.extension';
import { CreateSiswaDto, ImportSiswaDto } from './dto/create-siswa.dto';
import { UpdateSiswaDto } from './dto/update-siswa.dto';
import { UpdateTokenDto } from './dto/update-token.dto';
@Injectable()
export class SiswaService {
  constructor(
    @Inject('PrismaService') private prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {
  }
  async create(createSiswaDto: CreateSiswaDto) {
    return await this.prismaService.client.siswa.create({
      data: {
        notelp: createSiswaDto.notelp,
        name: createSiswaDto.name,
        rombel: createSiswaDto.rombel,
        nisn: createSiswaDto.nisn,
        nis: createSiswaDto.nis,
        password: await hash(createSiswaDto.nisn),
      }
    });
  }

  async findAll(
    page?: number,
    limit?: number,
    search?: string,
  ) {
    const [items, meta] = await this.prismaService.client.siswa.paginate({
      where: {
        ...search && {
          OR: [
            {
              name: {
                contains: search,
                mode: 'insensitive'
              },
            },
            {
              notelp: {
                contains: search,
                mode: 'insensitive'
              },
            },
            {
              nisn: {
                contains: search,
                mode: 'insensitive'
              },
            },
            {
              nis: {
                contains: search,
                mode: 'insensitive'
              },
            },
            {
              rombel: {
                contains: search,
                mode: 'insensitive'
              },
            },
          ],
        },

      },
      include: {
        telegram_account: true
      }
    }).withPages({
      limit: limit ?? 10,
      includePageCount: true,
      page: page ?? 1
    });
    return {
      items,
      meta
    }
  }

  async findOne(id: number) {
    return await this.prismaService.client.siswa.findUniqueOrThrow({
      where: {
        id
      }
    });
  }

  async update(id: number, updateSiswaDto: UpdateSiswaDto) {
    return await this.prismaService.client.siswa.update({
      where: {
        id
      },
      data: updateSiswaDto
    });
  }

  async remove(id: number) {
    return await this.prismaService.client.siswa.delete({
      where: {
        id
      }
    });
  }

  async import(data, keys) {
    const requiredKeys = ['notelp', 'nama', 'nis', 'nisn', 'rombel'];
    try {
      const isValid = requiredKeys.every(key => keys.includes(key));
      if (isValid) {
        let allData = []
        for (const row of data) {
          const rowData = {
            ...row.notelp && {
              notelp: row.notelp.toString()
            },
            ...row.nama && {
              name: row.nama.toString(),
            },
            ...row.nisn && {
              nisn: row.nisn.toString(),
              password: await hash(row.nisn.toString()),
            },
            ...row.nis && {
              nis: row.nis.toString(),
            },
            ...row.rombel && {
              rombel: row.rombel.toString().toUpperCase(),
            },
          }
          const createSiswaDto = plainToClass(ImportSiswaDto, rowData);
          const errors = await validate(createSiswaDto)

          if (!(errors.length > 0)) {
            const created = await this.prismaService.client.siswa.upsert({
              where: {
                nisn: rowData.nisn,
              },
              create: rowData,
              update: rowData
            })
            allData.push(created)
          }
        }
        return allData
      } else {
        throw new BadRequestException()
      }

    } catch (e) {
      if (e instanceof BadRequestException) {
        throw new BadRequestException()
      } else {
        throw new InternalServerErrorException()
      }
    }
  }

  async reset() {
    // return await this.prismaService.client.$queryRaw`TRUNCATE TABLE "siswa" CASCADE`
  }

  async registerRfid(id: number, updateToken: UpdateTokenDto) {
    return await this.prismaService.client.siswa.update({
      where: {
        id
      },
      data: {
        rfid_token: updateToken.token
      }
    })
  }


  async resetTokenRFID(id: number) {
    return await this.prismaService.client.siswa.update({
      where: {
        id
      },
      data: {
        rfid_token: null
      }
    })
  }

  async resetTelegram(id: number) {
    return await this.prismaService.client.telegram_account.delete({
      where: {
        siswaId: id,
      },
    })
  }

  async downloadTemplate() {
    return readFileSync(join(process.cwd(), 'templates/siswa-template.xlsx'))
  }

  async findByNISN(nisn: string) {
    return await this.prismaService.client.siswa.findUnique({
      where: {
        nisn
      }
    })
  }

  async updateToken(id: number, refreshToken: string) {
    return await this.prismaService.client.siswa.update({
      where: {
        id,
      },
      data: {
        refreshToken: refreshToken,
      },
    })
  }

  async getGroupClass() {
    const getRombel = await this.prismaService.client.siswa.findMany({
      select: {
        rombel: true
      },
      distinct: ['rombel'],
      orderBy: {
        rombel: 'asc'
      }
    })

    let rombels = [];

    for (const rombel of getRombel) {
      rombels.push(rombel.rombel)
    }
    return rombels;
  }
}
