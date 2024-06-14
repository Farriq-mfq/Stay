import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateSiswaDto } from './dto/create-siswa.dto';
import { UpdateSiswaDto } from './dto/update-siswa.dto';
import { ExtendedPrismaClient } from 'src/prisma.extension';
import { CustomPrismaService } from 'nestjs-prisma';
import { UpdateTokenDto } from './dto/update-token.dto'
import { siswa } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class SiswaService {
  constructor(
    @Inject('PrismaService') private prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {

  }
  async create(createSiswaDto: CreateSiswaDto) {
    return await this.prismaService.client.siswa.create({
      data: createSiswaDto
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

      }
    }).withPages({
      limit: limit || 10,
      includePageCount: true,
      page: page || 1
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

  async import(data) {
    try {
      for (const row of data) {
        const createSiswaDto = plainToClass(CreateSiswaDto, {
          notelp: row.notelp,
          name: row.nama,
          rombel: row.rombel,
          nisn: row.nisn,
          nis: row.nis,
        });
        const errors = await validate(createSiswaDto)


        if (!(errors.length > 0)) {
          const siswa = await this.prismaService.client.siswa.findUnique({
            where: {
              nisn: row.nisn.toString(),
              nis: row.nis.toString(),
              notelp: row.notelp.toString()
            }
          })

          if (!siswa) {
            await this.prismaService.client.siswa.create({
              data: {
                notelp: row.notelp.toString(),
                name: row.nama.toString(),
                rombel: row.rombel.toString().toUpperCase(),
                nisn: row.nisn.toString(),
                nis: row.nis.toString(),
              }
            })
          }
        }
      }
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException()
    }
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
}
