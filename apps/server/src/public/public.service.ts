import { Inject, Injectable } from "@nestjs/common";
import { SessionRoleType } from "@prisma/client";
import { CustomPrismaService } from "nestjs-prisma";
import { ExtendedPrismaClient } from "src/prisma.extension";

@Injectable()
export class PublicService {
    constructor(
        @Inject('PrismaService') private prismaService: CustomPrismaService<ExtendedPrismaClient>,
    ) {

    }

    async findAllSessions(page?: number,
        limit?: number,
        search?: string,
        role?: SessionRoleType) {
        const [items, meta] = await this.prismaService.client.presence_sessions.paginate({
            where: {
                ...search && {
                    OR: [
                        {
                            name: {
                                contains: search,
                                mode: 'insensitive'
                            },
                        }
                    ]
                },
                ...role && {
                    session_role_type: role
                }
            },
            include: {
                meeting_session: true,
                gateways: {
                    select: {
                        id: true,
                        name: true,
                        ip: true,
                        location: true,
                        role: true,
                        status: true,
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        }).withPages({
            limit: limit ?? 10,
            includePageCount: true,
            page: page ?? 1
        })

        return {
            items,
            meta
        }
    }
}