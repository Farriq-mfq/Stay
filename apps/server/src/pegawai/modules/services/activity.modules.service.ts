import { BadRequestException, Inject, Injectable, UnauthorizedException, UseGuards } from "@nestjs/common";
import { CustomPrismaService } from "nestjs-prisma";
import { AccessTokenPegawaiGuard } from "src/pegawai/guards/accessTokenPegawai.guard";
import { ExtendedPrismaClient } from "src/prisma.extension";
import { isDate } from "util/types";
import { CreateActivityDto } from "../dto/activity.dto";

@Injectable()
@UseGuards(AccessTokenPegawaiGuard)
export class PegawaiModulesActivityService {
    constructor(
        @Inject('PrismaService') private prismaService: CustomPrismaService<ExtendedPrismaClient>
    ) {

    }

    async getFindAllActivity(user: any, limit: string, after: string, before: string, search: string) {
        if (!user) throw new UnauthorizedException()
        return await this.prismaService.client.journal_activities.paginate({
            where: {
                pegawaiId: parseInt(user.sub),
                ...search && isDate(search) && {
                    createdAt: search,
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
        }).withCursor({
            limit: 10,
            after: after ?? null,
            before: before ?? null,
        });
    }

    async getActivityById(user: any, id: number) {
        if (!user) throw new UnauthorizedException()
        return await this.prismaService.client.journal_activities.findUniqueOrThrow({
            where: {
                pegawaiId: parseInt(user.sub),
                id: id
            }
        })
    }

    async createActivity(user: any, createActivityDto: CreateActivityDto) {
        if (!user) throw new UnauthorizedException()

        const activityToday = await this.prismaService.client.journal_activities.findFirst({
            where: {
                pegawaiId: parseInt(user.sub),
                date: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0)),
                },
            }
        })

        if (activityToday) throw new BadRequestException('Anda sudah melakukan aktivitas hari ini')


        return await this.prismaService.client.journal_activities.create({
            data: {
                pegawaiId: parseInt(user.sub),
                date: new Date(),
                description: createActivityDto.description,
            }
        })
    }
}