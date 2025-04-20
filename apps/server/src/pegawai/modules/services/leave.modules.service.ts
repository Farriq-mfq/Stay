import { Inject, Injectable, UnauthorizedException, UseGuards, BadRequestException } from "@nestjs/common";
import { CustomPrismaService } from "nestjs-prisma";
import { AccessTokenPegawaiGuard } from "src/pegawai/guards/accessTokenPegawai.guard";
import { ExtendedPrismaClient } from "src/prisma.extension";
import { isDate } from "util/types";
import { CreateLeaveDto } from "../../dto/leave.dto";
import { isValid, parseISO, differenceInDays, startOfDay, isAfter, isBefore } from "date-fns";

@Injectable()
@UseGuards(AccessTokenPegawaiGuard)
export class PegawaiModulesLeaveService {
    constructor(
        @Inject('PrismaService') private prismaService: CustomPrismaService<ExtendedPrismaClient>
    ) {

    }

    async getFindAllLeave(user: any, limit: string, after: string, before: string, search: string) {
        if (!user) throw new UnauthorizedException()
        return await this.prismaService.client.leave_requests.paginate({
            where: {
                pegawaiId: parseInt(user.sub),
                ...search && isDate(search) && {
                    applied_at: search,
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

    async getLeaveById(user: any, id: number) {
        if (!user) throw new UnauthorizedException()
        return await this.prismaService.client.leave_requests.findUniqueOrThrow({
            where: {
                pegawaiId: parseInt(user.sub),
                id: id
            }
        })
    }

    async createLeave(user: any, createLeaveDto: CreateLeaveDto) {
        const { start_date, end_date } = createLeaveDto;

        const parsedStartDate = parseISO(start_date);
        const parsedEndDate = parseISO(end_date);

        const today = startOfDay(new Date());
        const startDate = startOfDay(new Date(parsedStartDate));
        const endDate = startOfDay(new Date(parsedEndDate));

        if (!isValid(parsedStartDate) || !isValid(parsedEndDate)) {
            throw new BadRequestException("Invalid start_date or end_date");
        }
        if (isBefore(startDate, today) || isBefore(endDate, today)) {
            throw new BadRequestException("Tanggal mulai dan selesai tidak boleh kurang dari hari ini");
        }

        if (isAfter(startDate, endDate)) {
            throw new BadRequestException("Tanggal mulai tidak boleh lebih besar dari tanggal selesai");
        }

        const leavePending = await this.prismaService.client.leave_requests.findFirst({
            where: {
                pegawaiId: parseInt(user.sub),
                status: 'Pending',
            }
        });

        const leaveActive = await this.prismaService.client.leave_requests.findFirst({
            where: {
                pegawaiId: parseInt(user.sub),
                status: 'Approved',
                start_date: {
                    lte: new Date()
                },
                end_date: {
                    gte: new Date()
                },
            }
        });

        if (leaveActive) throw new BadRequestException("Izin tidak dapat diajukan, karena masih ada izin yang aktif");

        if (leavePending) {
            throw new BadRequestException("Izin tidak dapat diajukan, karena masih ada izin yang pending ");
        }

        const totalDays = differenceInDays(parsedEndDate, parsedStartDate) + 1;

        return await this.prismaService.client.leave_requests.create({
            data: {
                start_date,
                end_date,
                reason: createLeaveDto.reason,
                pegawaiId: parseInt(user.sub),
                duration: totalDays,
                applied_at: new Date(),
            },
        });
    }
}