import { BadRequestException, Inject, NotFoundException } from "@nestjs/common";
import { isJSON } from "class-validator";
import { endOfDay, startOfDay, parse, format } from "date-fns";
import { id } from "date-fns/locale";
import { CustomPrismaService } from "nestjs-prisma";
import { PegawaiService } from "src/pegawai/pegawai.service";
import { ExtendedPrismaClient } from "src/prisma.extension";
import { isValidDateString, validateDateRange } from "src/utils/helpers";
import * as xlsx from 'xlsx';

type FilterDate = {
    start_date?: string,
    end_date?: string
}

export class PresencePegawaiService {
    constructor(
        @Inject('PrismaService') private prismaService: CustomPrismaService<ExtendedPrismaClient>,
        private readonly pegawaiService: PegawaiService
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
        const [items, meta] = await this.prismaService.client.presences_pegawai.paginate({
            select: {
                id: true,
                presence_sessionsId: true,
                gatewaysId: true,
                pegawaiId: true,
                createdAt: true,
                updatedAt: true,
                gateway: true,
                pegawai: true,
                session: true,
                method: true,
                enter_time: true,
                exit_time: true,
            },
            where: {
                ...search && {
                    OR: [
                        {
                            pegawai: {
                                name: {
                                    contains: search,
                                    mode: 'insensitive'
                                },
                            },
                        },
                        {
                            pegawai: {
                                group: {
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
    async exportAll(sessionId: string, search?: string, date?: string) {
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
        const presences = await this.prismaService.client.presences_pegawai.findMany({
            select: {
                id: true,
                presence_sessionsId: true,
                gatewaysId: true,
                pegawaiId: true,
                createdAt: true,
                updatedAt: true,
                gateway: true,
                pegawai: true,
                session: true,
                method: true,
                enter_time: true,
                exit_time: true,
            },
            where: {
                ...search && {
                    OR: [
                        {
                            pegawai: {
                                name: {
                                    contains: search,
                                    mode: 'insensitive'
                                },
                            },
                        },
                        {
                            pegawai: {
                                group: {
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
        })

        const mappingPresences = presences.map(presence => ({
            Masuk: presence.enter_time ? format(presence.enter_time, 'dd/MM/yyyy HH:mm:ss', {
                locale: id
            }) : '-',
            Keluar: presence.exit_time ? format(presence.exit_time, 'dd/MM/yyyy HH:mm:ss', {
                locale: id
            }) : '-',
            Nama: presence.pegawai.name,
            Jabatan: presence.pegawai.position,
            Kelompok: presence.pegawai.group,
            Session: presence.session.name,
            Lokasi: presence.gateway ? presence.gateway.location : '-',
            Metode: presence.method,
        }))


        const worksheet = xlsx.utils.json_to_sheet(mappingPresences);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Presences');
        const buffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });
        return buffer;
    }

    async findAllByDaily(
        sessionId: string,
        search?: string,
        date?: string,
        group?: string
    ) {
        const groups = await this.pegawaiService.getGroup();
        const session = await this.prismaService.client.presence_sessions.findUniqueOrThrow({
            where: {
                id: parseInt(sessionId)
            }
        })
        if (!isValidDateString(date, 'yyyy-MM-dd')) {
            throw new BadRequestException("date invalid")
        }

        const parseDate = parse(date, 'yyyy-MM-dd', new Date(), { locale: id });
        const start = startOfDay(parseDate);
        const end = endOfDay(parseDate);

        if (group) {
            if (groups.includes(group)) {
                const pegawai = await this.prismaService.client.pegawai.findMany({
                    select: {
                        id: true,
                        name: true,
                        group: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                    where: {
                        group: {
                            equals: group
                        }
                    },
                    orderBy: {
                        name: 'asc'
                    }
                })

                const presences_pegawai = await this.prismaService.client.presences_pegawai.findMany({
                    include: {
                        gateway: true
                    },
                    where: {
                        createdAt: {
                            gte: start,
                            lt: end,
                        },
                        presence_sessionsId: session.id,
                    }
                })

                const checkpegawaiHasPresence = pegawai.map(sw => {
                    return {
                        ...sw,
                        hasPresence: presences_pegawai.some(presence => presence.pegawaiId === sw.id),
                        detailPresence: presences_pegawai.find(presence => presence.pegawaiId === sw.id) ?? null,
                    }
                })

                return {
                    group,
                    presences_pegawai: checkpegawaiHasPresence.map(presence => {
                        return {
                            id: presence.id,
                            name: presence.name,
                            group: presence.group,
                            createAt: presence.createdAt,
                            updateAt: presence.updatedAt,
                            hasPresence: presence.hasPresence,
                            detailPresence: presence.detailPresence,
                            gateway: presence.hasPresence ? `${presence.detailPresence.gateway.name}-${presence.detailPresence.gateway.location}` : '-',
                        }
                    })
                }
            } else {
                throw new NotFoundException("group Invalid")
            }
        } else {
            const pegawai = await this.prismaService.client.pegawai.findMany({
                select: {
                    id: true,
                    name: true,
                    group: true,
                    createdAt: true,
                    updatedAt: true,
                },
                orderBy: {
                    name: 'asc'
                }
            })
            const presences_pegawai = await this.prismaService.client.presences_pegawai.findMany({
                include: {
                    gateway: true
                },
                where: {
                    createdAt: {
                        gte: start,
                        lt: end,
                    },
                    presence_sessionsId: session.id,
                }
            })


            const checkpegawaiHasPresence = pegawai.map(sw => {
                return {
                    ...sw,
                    hasPresence: presences_pegawai.some(presence => presence.pegawaiId === sw.id),
                    detailPresence: presences_pegawai.find(presence => presence.pegawaiId === sw.id) ?? null,
                }
            })


            return {
                group: null,
                presences_pegawai: groups.map(group => {
                    const filterPresenceBygroup = checkpegawaiHasPresence.map(presence => {
                        return {
                            id: presence.id,
                            name: presence.name,
                            group: presence.group,
                            createAt: presence.createdAt,
                            updateAt: presence.updatedAt,
                            hasPresence: presence.hasPresence,
                            detailPresence: presence.detailPresence,
                            gateway: presence.hasPresence ? `${presence.detailPresence.gateway.name}-${presence.detailPresence.gateway.location}` : '-',
                        }
                    }).filter(pr => pr.group == group)
                    return {
                        [group]: filterPresenceBygroup
                    }
                })
            }
        }

    }

}