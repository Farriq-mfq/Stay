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
    const role = await this.prismaService.client.roles.create({
      data: {
        name: createRoleDto.name,
      }
    });
    await this.prismaService.client.role_permissions.createMany({
      data: createRoleDto.permissions.map(permission => ({
        roleId: role.id,
        permissionId: +permission
      }))
    })
    return role
  }

  async findAll(page?: number,
    limit?: number,
    search?: string) {
    const [items, meta] = await this.prismaService.client.roles.paginate({
      where: {
        ...search && {
          OR: [
            {
              name: {
                contains: search,
                mode: 'insensitive'
              },
            },
          ],
        },
      },
      include: {
        permissions: {
          select: {
            permission: true
          }
        }
      }
    }).withPages({
      limit: limit ?? 10,
      includePageCount: true,
      page: page ?? 1
    });
    return {
      items,
      meta
    };
  }


  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.prismaService.client.roles.findUniqueOrThrow({
      where: {
        id: id
      }
    })
    const roleUpdated = await this.prismaService.client.roles.update({
      where: {
        id: id
      },
      data: {
        name: updateRoleDto.name,
      }
    })

    await this.prismaService.client.role_permissions.deleteMany({
      where: {
        roleId: role.id
      }
    })

    await this.prismaService.client.role_permissions.createMany({
      data: updateRoleDto.permissions.map(permission => ({
        roleId: role.id,
        permissionId: +permission
      }))
    })

    return roleUpdated
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

  async findAllWithoutPagination() {
    return await this.prismaService.client.roles.findMany();
  }
}
