import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { hash } from 'argon2';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from 'src/prisma.extension';
// import { UpdateSiswaDto } from './dto/update-siswa.dto';
import { CreatePegawaiDto, ImportPegawaiDto } from './dto/create-pegawai.dto';
import { UpdatePegawaiTokenDto } from './dto/update-pegawai-token.dto';
import { UpdatePegawaiDto } from './dto/update-pegawai.dto';
import { readFileSync } from 'fs';
import { join } from 'path';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
@Injectable()
export class PegawaiService {
  constructor(
    @Inject('PrismaService') private prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {
  }

  async create(CreatePegawaiDto: CreatePegawaiDto) {
    return await this.prismaService.client.pegawai.create({
      data: {
        name: CreatePegawaiDto.name,
        username: CreatePegawaiDto.username,
        group: CreatePegawaiDto.group,
        position: CreatePegawaiDto.position,
        ...CreatePegawaiDto.sign_picture != null && {
          sign_picture: CreatePegawaiDto.sign_picture
        },
        password: await hash(CreatePegawaiDto.username),
      }
    });
  }

  async findAll(
    page?: number,
    limit?: number,
    search?: string,
  ) {
    const [items, meta] = await this.prismaService.client.pegawai.paginate({
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
              username: {
                contains: search,
                mode: 'insensitive'
              },
            },
            {
              position: {
                contains: search,
                mode: 'insensitive'
              },
            },
            {
              group: {
                contains: search,
                mode: 'insensitive'
              },
            },
          ],
        },

      },
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

  async findWithoutPaginate() {
    return await this.prismaService.client.pegawai.findMany({
      select: {
        id: true,
        name: true,
        position: true,
        group: true,
        sign_picture: true
      },
      orderBy: {
        name: "asc"
      }
    });
  }

  async findOne(id: number) {
    return await this.prismaService.client.pegawai.findUniqueOrThrow({
      where: {
        id
      }
    });
  }

  async update(id: number, updatepegawaiDto: UpdatePegawaiDto) {
    return await this.prismaService.client.pegawai.update({
      where: {
        id
      },
      data: updatepegawaiDto
    });
  }

  async remove(id: number) {
    return await this.prismaService.client.pegawai.delete({
      where: {
        id
      }
    });
  }

  async import(data, keys) {
    const requiredKeys = ['nama', 'username', 'jabatan', 'kelompok', 'ttd'];
    try {
      const isValid = requiredKeys.every(key => keys.includes(key));
      if (isValid) {
        let allData = []
        if (data.length > 0) {
          for (const row of data) {
            const rowData = {
              ...row.nama && {
                name: row.nama
              },
              ...row.username && {
                username: row.username,
                password: await hash(row.username),
              },
              ...row.jabatan && {
                position: row.jabatan,
              },
              ...row.kelompok && {
                group: row.kelompok.toUpperCase(),
              },
              ...row.ttd && {
                sign_picture: row.ttd,
              },
            }
            const createPegawaiValidate = plainToClass(ImportPegawaiDto, rowData);
            const errors = await validate(createPegawaiValidate)

            if (!(errors.length > 0)) {
              const created = await this.prismaService.client.pegawai.upsert({
                where: {
                  username: rowData.username,
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
      } else {
        throw new BadRequestException()
      }

    } catch (e) {
      if (e instanceof BadRequestException) {
        throw new BadRequestException()
      } else {
        console.log(e)
        throw new InternalServerErrorException()
      }
    }
  }

  // async reset() {
  //   // return await this.prismaService.client.$queryRaw`TRUNCATE TABLE "siswa" CASCADE`
  // }

  async registerRfid(id: number, updateToken: UpdatePegawaiTokenDto) {
    return await this.prismaService.client.pegawai.update({
      where: {
        id
      },
      data: {
        rfid_token: updateToken.token
      }
    })
  }


  async resetTokenRFID(id: number) {
    return await this.prismaService.client.pegawai.update({
      where: {
        id
      },
      data: {
        rfid_token: null
      }
    })
  }

  // async resetTelegram(id: number) {
  //   return await this.prismaService.client.telegram_account.delete({
  //     where: {
  //       siswaId: id,
  //     },
  //   })
  // }

  async downloadTemplate() {
    return readFileSync(join(process.cwd(), 'templates/pegawai-template.xlsx'))
  }

  async findByUsername(username: string) {
    return await this.prismaService.client.pegawai.findUnique({
      where: {
        username
      }
    })
  }

  async updateToken(id: number, refreshToken: string) {
    return await this.prismaService.client.pegawai.update({
      where: {
        id,
      },
      data: {
        refreshToken: refreshToken,
      },
    })
  }

  async getGroup() {
    const getGroups = await this.prismaService.client.pegawai.findMany({
      select: {
        group: true
      },
      distinct: ['group'],
      orderBy: {
        group: 'asc'
      }
    })

    let groups = [];

    for (const group of getGroups) {
      groups.push(group.group)
    }
    return groups;
  }
}
