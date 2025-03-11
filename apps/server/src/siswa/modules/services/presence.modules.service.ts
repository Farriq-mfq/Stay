import { Inject, Injectable } from "@nestjs/common";
import { format } from "date-fns";
import { CustomPrismaService } from "nestjs-prisma";
import { ExtendedPrismaClient } from "src/prisma.extension";

@Injectable()
export class SiswaModulesPresenceService {
    constructor(
        @Inject('PrismaService') private prismaService: CustomPrismaService<ExtendedPrismaClient>,

    ) { }
    async findAll(user: any, limit: string, after: string, before: string, search: string) {
        if (!user) return {}

        const presences = await this.prismaService.client.presences.paginate({
            where: {
                siswaId: parseInt(user.sub),
                ...search && {
                    session: {
                        name: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    }
                }
            },
            include: {
                session: true,
                gateway: {
                    select: {
                        location: true
                    }
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

        const data = presences[0];

        const createdAt = [...new Set(data.map((presence) => format(presence.createdAt, 'yyyy-MM-dd')))];

        const parseDatabyCreatedAt = createdAt.map((dt) => {
            return {
                "date": dt,
                "presences": data.filter((presence) => format(presence.createdAt, 'yyyy-MM-dd') === dt)
            }
        })

        return [
            parseDatabyCreatedAt,
            presences[1]
        ]
    }

    async find(user: any, id: string) {
        if (!user) return {}

        const presence = await this.prismaService.client.presences.findUniqueOrThrow({
            where: {
                id: parseInt(id),
                siswaId: parseInt(user.sub)
            },
            include: {
                session: true,
                gateway: {
                    select: {
                        location: true
                    }
                }
            },
        })

        return presence
    }
}