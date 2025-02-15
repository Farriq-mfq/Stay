import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { hash } from 'argon2';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from 'src/prisma.extension';
// import { UpdateSiswaDto } from './dto/update-siswa.dto';
import { CreatePegawaiDto, ImportPegawaiDto, UpdatePasswordPegawaiDto } from './dto/create-pegawai.dto';
import { UpdatePegawaiTokenDto } from './dto/update-pegawai-token.dto';
import { UpdatePegawaiDto } from './dto/update-pegawai.dto';
import { readFileSync } from 'fs';
import { join } from 'path';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { CloudinaryService } from 'src/services/cloudinary.service';
import { format } from 'date-fns';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
@Injectable()
export class PegawaiService {
  constructor(
    @Inject('PrismaService') private prismaService: CustomPrismaService<ExtendedPrismaClient>,
    private readonly cloudinaryService: CloudinaryService
  ) {
  }

  async create(CreatePegawaiDto: CreatePegawaiDto, files: { sign_picture?: Express.Multer.File, profile_picture?: Express.Multer.File } | undefined) {
    let results: Record<'sign_picture' | 'profile_picture' | string, UploadApiResponse | UploadApiErrorResponse> = {};
    if (files && files.sign_picture) {
      try {
        const result = await this.cloudinaryService.uploadImage(files.sign_picture[0], `${format(new Date(), "yyyy")}-${CreatePegawaiDto.group}-sign_picture`, `${CreatePegawaiDto.username}`);
        results['sign_picture'] = result
      } catch (e) {
        throw new InternalServerErrorException()
      }
    }
    if (files && files.profile_picture) {
      try {
        const result = await this.cloudinaryService.uploadImage(files.profile_picture[0], `${format(new Date(), "yyyy")}-${CreatePegawaiDto.group}-profile_picture`, `${CreatePegawaiDto.username}`);
        results['profile_picture'] = result
      } catch (e) {
        throw new InternalServerErrorException()
      }
    }

    return await this.prismaService.client.pegawai.create({
      data: {
        name: CreatePegawaiDto.name,
        username: CreatePegawaiDto.username,
        group: CreatePegawaiDto.group,
        position: CreatePegawaiDto.position,
        ...results.sign_picture && {
          sign_picture: results.sign_picture.url,
          sign_picture_public_id: results.sign_picture.public_id
        },
        ...results.profile_picture && {
          profile_picture: results.profile_picture.url,
          profile_picture_public_id: results.profile_picture.public_id
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

  async findWithoutPaginate(sessionId: string) {
    const session = await this.prismaService.client.presence_sessions.findUniqueOrThrow({
      where: {
        id: +sessionId
      }
    })
    const pegawai = await this.prismaService.client.pegawai.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        position: true,
        group: true,
        sign_picture: true,
      },

      orderBy: {
        name: "asc"
      }
    });

    return pegawai.filter(pg => session.group ? session.group.includes(pg.group) : pg.group)
  }

  async findOne(id: number) {
    return await this.prismaService.client.pegawai.findUniqueOrThrow({
      where: {
        id
      }
    });
  }

  async update(id: number, updatepegawaiDto: UpdatePegawaiDto, files: { sign_picture?: Express.Multer.File, profile_picture?: Express.Multer.File } | undefined) {
    const pegawai = await this.prismaService.client.pegawai.findUniqueOrThrow({
      where: {
        id
      }
    })

    let results: Record<'sign_picture' | 'profile_picture' | string, UploadApiResponse | UploadApiErrorResponse> = {};

    if (files && files.sign_picture) {

      if (pegawai.sign_picture_public_id) await this.cloudinaryService.deleteImage(pegawai.sign_picture_public_id)

      try {
        results['sign_picture'] = await this.cloudinaryService.uploadImage(files.sign_picture[0], `${format(new Date(), "yyyy")}-${updatepegawaiDto.group}-sign_picture`, `${updatepegawaiDto.username}`);
      } catch (e) {
        throw new InternalServerErrorException()
      }
    }

    if (files && files.profile_picture) {

      if (pegawai.profile_picture_public_id) await this.cloudinaryService.deleteImage(pegawai.profile_picture_public_id)

      try {
        results['profile_picture'] = await this.cloudinaryService.uploadImage(files.profile_picture[0], `${format(new Date(), "yyyy")}-${updatepegawaiDto.group}-profile_picture`, `${updatepegawaiDto.username}`);
      } catch (e) {
        throw new InternalServerErrorException()
      }
    }

    return await this.prismaService.client.pegawai.update({
      where: {
        id
      },
      data: {
        ...updatepegawaiDto,
        ...results.sign_picture && {
          sign_picture: results.sign_picture.url,
          sign_picture_public_id: results.sign_picture.public_id
        },
        ...results.profile_picture && {
          profile_picture: results.profile_picture.url,
          profile_picture_public_id: results.profile_picture.public_id
        }
      }
    });

  }

  async remove(id: number) {
    const pegawai = await this.prismaService.client.pegawai.findUniqueOrThrow({
      where: {
        id
      }
    })

    if (pegawai.sign_picture_public_id) await this.cloudinaryService.deleteImage(pegawai.sign_picture_public_id)
    if (pegawai.profile_picture_public_id) await this.cloudinaryService.deleteImage(pegawai.profile_picture_public_id)

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

            // let result = null;
            // if (rowData.sign_picture) {
            //   try {
            //     result = await this.cloudinaryService.uploadImageFromUrl(rowData.sign_picture, `${format(new Date(), "yyyy")}-${rowData.group}`, rowData.username)
            //   } catch (e) {
            //   }
            // }
            // delete rowData.sign_picture

            if (!(errors.length > 0)) {
              const created = await this.prismaService.client.pegawai.upsert({
                where: {
                  username: rowData.username,
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

  async resetPassword(id: number, updatePasswordPegawaiDto: UpdatePasswordPegawaiDto) {
    await this.prismaService.client.pegawai.findFirstOrThrow({
      where: {
        id
      }
    })

    return await this.prismaService.client.pegawai.update({
      where: {
        id
      },
      data: {
        password: await hash(updatePasswordPegawaiDto.new_password)
      }
    })
  }
}
