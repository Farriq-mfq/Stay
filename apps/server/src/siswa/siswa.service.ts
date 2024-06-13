import { Inject, Injectable } from '@nestjs/common';
import { CreateSiswaDto } from './dto/create-siswa.dto';
import { UpdateSiswaDto } from './dto/update-siswa.dto';
import { ExtendedPrismaClient } from 'src/prisma.extension';
import { CustomPrismaService } from 'nestjs-prisma';

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

  async findAll() {
    return await this.prismaService.client.siswa.paginate().withPages({
      limit: 10,
      includePageCount: true,
      page: 1
    });
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

  async import(){
    return 'import'
  }
}
