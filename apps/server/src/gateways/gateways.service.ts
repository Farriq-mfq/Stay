import { Inject, Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import { CreateGatewayDto } from './dto/create-gateway.dto';
import { UpdateGatewayDto } from './dto/update-gateway.dto';
import { ExtendedPrismaClient } from 'src/prisma.extension';

@Injectable()
export class GatewaysService {
  constructor(
    @Inject('PrismaService') private prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {

  }
  create(createGatewayDto: CreateGatewayDto) {
    return 'This action adds a new gateway';
  }

  async findAll() {
    const [items, meta] = await this.prismaService.client.gateways.paginate().withPages({
      limit: 10,
      includePageCount: true,
      page: 1
    });
    return {
      items,
      meta
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} gateway`;
  }

  update(id: number, updateGatewayDto: UpdateGatewayDto) {
    return `This action updates a #${id} gateway`;
  }

  remove(id: number) {
    return `This action removes a #${id} gateway`;
  }
}
