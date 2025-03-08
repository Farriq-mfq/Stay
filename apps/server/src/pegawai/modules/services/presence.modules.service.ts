import { Inject, Injectable } from "@nestjs/common";
import { format } from "date-fns";
import { CustomPrismaService } from "nestjs-prisma";
import { ExtendedPrismaClient } from "src/prisma.extension";

@Injectable()
export class PegawaiModulesPresenceService {
    constructor(
        @Inject('PrismaService') private prismaService: CustomPrismaService<ExtendedPrismaClient>,

    ) { }
    async findAll(user: any, limit: number, after: string, before: string) {
        if (!user) return {}

        const presences = await this.prismaService.client.presences_pegawai.paginate({
            where: {
                id: user.id
            },
            include: {
                session: true,
                meeting_session: true,
                gateway: {
                    select: {
                        location: true
                    }
                }
            }
        }).withCursor({
            limit: limit ?? 1,
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
}