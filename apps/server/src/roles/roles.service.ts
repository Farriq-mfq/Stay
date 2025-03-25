import { Inject, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from 'src/prisma.extension';

@Injectable()
export class RolesService {
  constructor(
    @Inject('PrismaService') private prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) { }
  async create(createRoleDto: CreateRoleDto) {
    return await this.prismaService.client.roles.create({
      data: {
        name: createRoleDto.name,
        permissions: {
          connect: createRoleDto.permissions.map(permission => ({ id: +permission }))
        }
      }
    });
  }

  async findAll() {
    return await this.prismaService.client.roles.paginate().withPages({
      limit: 1,
      page: 1
    });
  }


  async update(id: number, updateRoleDto: UpdateRoleDto) {
    return await this.prismaService.client.roles.update({
      where: {
        id: id
      },
      data: {
        name: updateRoleDto.name,
        permissions: {
          connect: updateRoleDto.permissions.map(permission => ({ id: +permission }))
        }
      }
    })
  }

  async remove(id: number) {
    const role = await this.prismaService.client.roles.findUniqueOrThrow({
      where: {
        id: id
      }
    })
    return await this.prismaService.client.roles.delete({
      where: {
        id: role.id
      }
    })
  }
}
