import { Inject, Injectable } from "@nestjs/common";
import { CustomPrismaService } from "nestjs-prisma";
import { ExtendedPrismaClient } from "src/prisma.extension";
import { FeatureUpdateDto } from "./dto/features.dto";

@Injectable()
export class FeaturesService {
    constructor(
        @Inject('PrismaService') private prismaService: CustomPrismaService<ExtendedPrismaClient>,
    ) {

    }

    async findAll(page?: number, limit?: number, search?: string) {
        const [items, meta] = await this.prismaService.client.features.paginate({
            where: {
                title: {
                    contains: search,
                    mode: "insensitive"
                }
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


    async update(id: number, featureUpdateDto: FeatureUpdateDto) {

        const feature = await this.prismaService.client.features.findUniqueOrThrow({
            where: {
                id
            }
        })

        if (featureUpdateDto.role !== feature.role) {
            await this.prismaService.client.features.update({
                where: {
                    id
                },
                data: {
                    group: null
                }
            })
        }

        return await this.prismaService.client.features.update({
            where: {
                id
            },
            data: {
                title: featureUpdateDto.title,
                icon: featureUpdateDto.icon,
                iconColor: featureUpdateDto.iconColor,
                status: featureUpdateDto.status,
                group: featureUpdateDto.group ? featureUpdateDto.group.length == 0 ? null : JSON.stringify(featureUpdateDto.group) : null,
            },
        })
    }
}