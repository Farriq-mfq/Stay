import { BadRequestException, Inject, NotFoundException } from "@nestjs/common";
import { isJSON } from "class-validator";
import { endOfDay, startOfDay } from "date-fns";
import { CustomPrismaService } from "nestjs-prisma";
import { parse } from "path";
import { ExtendedPrismaClient } from "src/prisma.extension";
import { isValidDateString, validateDateRange } from "src/utils/helpers";
type FilterDate = {
    start_date?: string,
    end_date?: string
}

export class PresencePegawaiService {
    constructor(
        @Inject('PrismaService') private prismaService: CustomPrismaService<ExtendedPrismaClient>,
    ) { }
    async findAll(sessionId: string,
        page?: number,
        limit?: number,
        search?: string,
        date?: string) {
        let filterDate: FilterDate | null = null;
        if (isJSON(date)) {
            const parseFilterDateAsJson = JSON.parse(date) as FilterDate;
            if (isValidDateString(parseFilterDateAsJson.start_date, 'yyyy-MM-dd') && isValidDateString(parseFilterDateAsJson.end_date, 'yyyy-MM-dd')) {
                if (validateDateRange(parseFilterDateAsJson.start_date, parseFilterDateAsJson.end_date)) {
                    filterDate = parseFilterDateAsJson
                } else {
                    throw new BadRequestException('Invalid date range');
                }
            }
        }


        const session = await this.prismaService.client.presence_sessions.findUniqueOrThrow({
            where: {
                id: parseInt(sessionId)
            }
        })
        const [items, meta] = await this.prismaService.client.presences.paginate({
            select: {
                id: true,
                presence_sessionsId: true,
                gatewaysId: true,
                siswaId: true,
                createdAt: true,
                updatedAt: true,
                gateway: true,
                siswa: true,
                session: true,
                method: true,
                enter_time: true,
                exit_time: true,
            },
            where: {
                ...search && {
                    OR: [
                        {
                            siswa: {
                                name: {
                                    contains: search,
                                    mode: 'insensitive'
                                },
                            },
                        },
                        {
                            siswa: {
                                rombel: {
                                    contains: search,
                                    mode: 'insensitive'
                                }
                            }
                        },
                        {
                            gateway: {
                                name: {
                                    contains: search,
                                    mode: 'insensitive'
                                }
                            },
                        },
                        {
                            gateway: {
                                location: {
                                    contains: search,
                                    mode: 'insensitive'
                                }
                            },
                        },
                    ],
                },
                presence_sessionsId: session.id,
                ...(filterDate && {
                    createdAt: {
                        gte: new Date(filterDate.start_date),
                        lte: new Date(filterDate.end_date)
                    }
                })
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

    // async findAllByDaily(
    //     sessionId: string,
    //     search?: string,
    //     date?: string,
    //     rombel?: string
    // ) {
    //     const rombels = await this.siswaService.getGroupClass();
    //     const session = await this.prismaService.client.presence_sessions.findUniqueOrThrow({
    //         where: {
    //             id: parseInt(sessionId)
    //         }
    //     })
    //     if (!isValidDateString(date, 'yyyy-MM-dd')) {
    //         throw new BadRequestException("date invalid")
    //     }

    //     const parseDate = parse(date, 'yyyy-MM-dd', new Date(), { locale: id });
    //     const start = startOfDay(parseDate);
    //     const end = endOfDay(parseDate);

    //     if (rombel) {
    //         if (rombels.includes(rombel)) {
    //             const siswa = await this.prismaService.client.siswa.findMany({
    //                 select: {
    //                     id: true,
    //                     name: true,
    //                     rombel: true,
    //                     createdAt: true,
    //                     updatedAt: true,
    //                 },
    //                 where: {
    //                     rombel: {
    //                         equals: rombel
    //                     }
    //                 },
    //                 orderBy: {
    //                     name: 'asc'
    //                 }
    //             })

    //             const presences = await this.prismaService.client.presences.findMany({
    //                 include: {
    //                     gateway: true
    //                 },
    //                 where: {
    //                     createdAt: {
    //                         gte: start,
    //                         lt: end,
    //                     },
    //                     presence_sessionsId: session.id,
    //                 }
    //             })

    //             const checkSiswaHasPresence = siswa.map(sw => {
    //                 return {
    //                     ...sw,
    //                     hasPresence: presences.some(presence => presence.siswaId === sw.id),
    //                     detailPresence: presences.find(presence => presence.siswaId === sw.id) ?? null,
    //                 }
    //             })

    //             return {
    //                 rombel,
    //                 presences: checkSiswaHasPresence.map(presence => {
    //                     return {
    //                         id: presence.id,
    //                         name: presence.name,
    //                         rombel: presence.rombel,
    //                         createAt: presence.createdAt,
    //                         updateAt: presence.updatedAt,
    //                         hasPresence: presence.hasPresence,
    //                         detailPresence: presence.detailPresence,
    //                         gateway: presence.hasPresence ? `${presence.detailPresence.gateway.name}-${presence.detailPresence.gateway.location}` : '-',
    //                     }
    //                 })
    //             }
    //         } else {
    //             throw new NotFoundException("Rombel Invalid")
    //         }
    //     } else {
    //         const siswa = await this.prismaService.client.siswa.findMany({
    //             select: {
    //                 id: true,
    //                 name: true,
    //                 rombel: true,
    //                 createdAt: true,
    //                 updatedAt: true,
    //             },
    //             orderBy: {
    //                 name: 'asc'
    //             }
    //         })
    //         const presences = await this.prismaService.client.presences.findMany({
    //             include: {
    //                 gateway: true
    //             },
    //             where: {
    //                 createdAt: {
    //                     gte: start,
    //                     lt: end,
    //                 },
    //                 presence_sessionsId: session.id,
    //             }
    //         })


    //         const checkSiswaHasPresence = siswa.map(sw => {
    //             return {
    //                 ...sw,
    //                 hasPresence: presences.some(presence => presence.siswaId === sw.id),
    //                 detailPresence: presences.find(presence => presence.siswaId === sw.id) ?? null,
    //             }
    //         })


    //         return {
    //             rombel: null,
    //             presences: rombels.map(rombel => {
    //                 const filterPresenceByRombel = checkSiswaHasPresence.map(presence => {
    //                     return {
    //                         id: presence.id,
    //                         name: presence.name,
    //                         rombel: presence.rombel,
    //                         createAt: presence.createdAt,
    //                         updateAt: presence.updatedAt,
    //                         hasPresence: presence.hasPresence,
    //                         detailPresence: presence.detailPresence,
    //                         gateway: presence.hasPresence ? `${presence.detailPresence.gateway.name}-${presence.detailPresence.gateway.location}` : '-',
    //                     }
    //                 }).filter(pr => pr.rombel == rombel)
    //                 return {
    //                     [rombel]: filterPresenceByRombel
    //                 }
    //             })
    //         }
    //     }

    // }

}