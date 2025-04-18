import { Inject, Injectable } from "@nestjs/common";
import { CustomPrismaService } from "nestjs-prisma";
import { ExtendedPrismaClient } from "../prisma.extension";
import { ApprovedDto } from "./dto/leave.dto";
@Injectable()
export class LeaveService {
    constructor(
        @Inject('PrismaService') private readonly prismaService: CustomPrismaService<ExtendedPrismaClient>,
    ) { }

    async findAll(page?: number, limit?: number, search?: string) {
        const [items, meta] = await this.prismaService.client.leave_requests.paginate({
            where: {
                pegawai: {
                    name: {
                        contains: search,
                        mode: "insensitive"
                    }
                },
            },
            include: {
                pegawai: {
                    select: {
                        name: true,
                    }
                }
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

    async approve(user: any, id: number, approvedDto: ApprovedDto) {
        const getUser = await this.prismaService.client.users.findUniqueOrThrow({
            where: {
                id: parseInt(user.sub)
            }
        });

        const leave = await this.prismaService.client.leave_requests.findUniqueOrThrow({
            where: {
                id: id,
                status: "Pending"
            }
        });
        if (leave.status !== "Pending") {
            throw new Error("Leave request is not pending");
        }
        return this.prismaService.client.leave_requests.update({
            where: {
                id: id
            },
            data: {
                status: "Approved",
                processed_at: new Date(),
                notes: approvedDto.notes,
                processed_by: getUser.name
            }
        });

    }
    async reject(user: any, id: number, approvedDto: ApprovedDto) {
        const getUser = await this.prismaService.client.users.findUniqueOrThrow({
            where: {
                id: parseInt(user.sub)
            }
        });

        const leave = await this.prismaService.client.leave_requests.findUniqueOrThrow({
            where: {
                id: id,
                status: "Pending"
            }
        });
        if (leave.status !== "Pending") {
            throw new Error("Leave request is not pending");
        }
        return this.prismaService.client.leave_requests.update({
            where: {
                id: id
            },
            data: {
                status: "Rejected",
                processed_at: new Date(),
                notes: approvedDto.notes,
                processed_by: getUser.name
            }
        });

    }
}