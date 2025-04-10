import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { hash, verify } from 'argon2';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { format } from 'date-fns';
import { readFileSync } from 'fs';
import { CustomPrismaService } from 'nestjs-prisma';
import { join } from 'path';
import { ExtendedPrismaClient } from 'src/prisma.extension';
import { CloudinaryService } from 'src/services/cloudinary.service';
import { CreateSiswaDto, ImportSiswaDto, ResetPasswordDto, UpdateRombelDto } from './dto/create-siswa.dto';
import { UpdateSiswaDto } from './dto/update-siswa.dto';
import { UpdateTokenDto } from './dto/update-token.dto';
import { AccountableType } from '@prisma/client';

@Injectable()
export class SiswaService {
  constructor(
    @Inject('PrismaService') private prismaService: CustomPrismaService<ExtendedPrismaClient>,
    private readonly cloudinaryService: CloudinaryService,
  ) {
  }
  async create(createSiswaDto: CreateSiswaDto, file: Express.Multer.File | undefined) {

    if (file) {
      let result = null;
      try {
        result = await this.cloudinaryService.uploadImage(file, `${format(new Date(), "yyyy")}-${createSiswaDto.rombel}`, `${createSiswaDto.nisn}`)
      } catch (e) {
        throw new InternalServerErrorException()
      }

      return await this.prismaService.client.siswa.create({
        data: {
          notelp: createSiswaDto.notelp,
          name: createSiswaDto.name,
          rombel: createSiswaDto.rombel,
          nisn: createSiswaDto.nisn,
          nis: createSiswaDto.nis,
          password: await hash(createSiswaDto.nisn),
          ...result && {
            profile_picture: result.url,
            picture_public_id: result.public_id
          }
        }
      });

    } else {
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
      },
      orderBy: {
        createdAt: 'desc'
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
    const siswa = await this.prismaService.client.siswa.findUniqueOrThrow({
      where: {
        id
      }
    });
    const account = await this.prismaService.client.account.findFirst({
      where: {
        accountableId: siswa.id,
        accountableType: AccountableType.SISWA
      }
    })
    return { ...siswa, account }
  }

  async update(id: number, updateSiswaDto: UpdateSiswaDto, file: Express.Multer.File | undefined) {
    const siswa = await this.prismaService.client.siswa.findUniqueOrThrow({
      where: {
        id
      }
    })

    if (file) {

      if (siswa.picture_public_id) await this.cloudinaryService.deleteImage(siswa.picture_public_id)

      let result = null;
      try {
        result = await this.cloudinaryService.uploadImage(file, `${format(new Date(), "yyyy")}-${updateSiswaDto.rombel}`, `${updateSiswaDto.nisn}`)
      } catch (e) {
        throw new InternalServerErrorException()
      }


      return await this.prismaService.client.siswa.update({
        where: {
          id
        },
        data: {
          ...updateSiswaDto,
          ...result && {
            profile_picture: result.url,
            picture_public_id: result.public_id
          }
        }
      });
    } else {
      return await this.prismaService.client.siswa.update({
        where: {
          id
        },
        data: updateSiswaDto
      });

    }
  }

  async remove(id: number) {
    const siswa = await this.prismaService.client.siswa.findUniqueOrThrow({
      where: {
        id
      }
    })

    if (siswa.picture_public_id) await this.cloudinaryService.deleteImage(siswa.picture_public_id)

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
            ...row.image_url && {
              image_url: row.image_url.toString()
            }
          }
          const createSiswaDto = plainToClass(ImportSiswaDto, rowData);
          const errors = await validate(createSiswaDto)

          if (!(errors.length > 0)) {

            let result = null;
            if (rowData.image_url) {
              try {
                result = await this.cloudinaryService.uploadImageFromUrl(rowData.image_url, `${format(new Date(), "yyyy")}-${rowData.rombel}`, rowData.nisn)
              } catch (e) {
              }
            }

            delete rowData.image_url;

            const created = await this.prismaService.client.siswa.upsert({
              where: {
                nisn: rowData.nisn,
              },
              create: rowData,
              update: rowData,
            })
            allData.push(created)
          }
        }
        return allData
      } else {
        throw new BadRequestException()
      }

    } catch (e) {
      console.log(e)
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

  async updateRombel(updateRombelDto: UpdateRombelDto) {
    const rombels = await this.getGroupClass();
    if (rombels.includes(updateRombelDto.rombel)) {
      return await this.prismaService.client.siswa.updateMany({
        data: {
          rombel: updateRombelDto.updated_rombel
        },
        where: {
          rombel: updateRombelDto.rombel
        }
      })
    } else {
      throw new NotFoundException("Rombel tidak ada")
    }
  }

  async resetPassword(id: number, resetPasswordDto: ResetPasswordDto) {

    const siswa = await this.prismaService.client.siswa.findUniqueOrThrow({
      where: {
        id
      }
    })

    return await this.prismaService.client.siswa.update({
      where: {
        id: siswa.id
      },
      data: {
        password: await hash(resetPasswordDto.password)
      }
    })
  }

  async resetLogin(id: number) {
    const siswa = await this.prismaService.client.siswa.findUniqueOrThrow({
      where: {
        id
      }
    })
    return await this.prismaService.client.siswa.update({
      where: {
        id: siswa.id
      },
      data: {
        refreshToken: null
      }
    })
  }
}
