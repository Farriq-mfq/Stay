import { BadRequestException, Inject, NotFoundException } from "@nestjs/common";
import { isJSON } from "class-validator";
import { endOfDay, startOfDay, parse, format, startOfMonth, endOfMonth, eachDayOfInterval, isAfter } from "date-fns";
import { id, th } from "date-fns/locale";
import { CustomPrismaService } from "nestjs-prisma";
import { PegawaiService } from "src/pegawai/pegawai.service";
import { ExtendedPrismaClient } from "src/prisma.extension";
import { isValidDateString, validateAndFormatDateYear, validateDateRange } from "src/utils/helpers";
import * as xlsx from 'xlsx';
import * as JSZip from 'jszip';

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
                    presences: checkpegawaiHasPresence.map(presence => {
                        return {
                            id: presence.id,
                            name: presence.name,
                            group: presence.group,
                            createAt: presence.createdAt,
                            updateAt: presence.updatedAt,
                            hasPresence: presence.hasPresence,
                            detailPresence: presence.detailPresence,
                            gateway: presence.hasPresence ? `${presence.detailPresence.gateway ? presence.detailPresence.gateway.name : '-'}-${presence.detailPresence.gateway ? presence.detailPresence.gateway.location : '-'}` : '-',
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
                presences: groups.map(group => {
                    const filterPresenceBygroup = checkpegawaiHasPresence.map(presence => {
                        return {
                            id: presence.id,
                            name: presence.name,
                            group: presence.group,
                            createAt: presence.createdAt,
                            updateAt: presence.updatedAt,
                            hasPresence: presence.hasPresence,
                            detailPresence: presence.detailPresence,
                            gateway: presence.hasPresence ? `${presence.detailPresence.gateway ? presence.detailPresence.gateway.name : '-'}-${presence.detailPresence.gateway ? presence.detailPresence.gateway.location : '-'}` : '-'
                        }
                    }).filter(pr => pr.group == group)
                    return {
                        [group]: filterPresenceBygroup
                    }
                })
            }
        }

    }


    async exportByDaily(
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
                        position: true,
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

                const presences = await this.prismaService.client.presences_pegawai.findMany({
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
                        hasPresence: presences.some(presence => presence.pegawaiId === sw.id),
                        detailPresence: presences.find(presence => presence.pegawaiId === sw.id) ?? null,
                    }
                })


                const mappingPresences = checkpegawaiHasPresence.map(presence => ({
                    Masuk: presence.hasPresence ? presence.detailPresence.enter_time ? format(presence.detailPresence.enter_time, 'dd/MM/yyyy HH:mm:ss', {
                        locale: id
                    }) : '-' : '-',
                    Keluar: presence.hasPresence ? presence.detailPresence.exit_time ? format(presence.detailPresence.exit_time, 'dd/MM/yyyy HH:mm:ss', {
                        locale: id
                    }) : '-' : '-',
                    Nama: presence.name,
                    Jabatan: presence.position,
                    Kelompok: presence.group,
                    Status: presence.hasPresence ? "Presensi" : "Tidak Presensi",
                    Session: session.name,
                    Gateway: presence.hasPresence ? `${presence.detailPresence.gateway ? presence.detailPresence.gateway.name : '-'}-${presence.detailPresence.gateway ? presence.detailPresence.gateway.location : '-'}` : '-',
                }))


                const worksheet = xlsx.utils.json_to_sheet(mappingPresences);
                const workbook = xlsx.utils.book_new();
                xlsx.utils.book_append_sheet(workbook, worksheet, 'Presences');
                const buffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });
                return buffer;
            } else {
                throw new BadRequestException("group invalid")
            }
        } else {
            const pegawai = await this.prismaService.client.pegawai.findMany({
                select: {
                    id: true,
                    name: true,
                    group: true,
                    position: true,
                    createdAt: true,
                    updatedAt: true,
                },
                orderBy: {
                    name: 'asc'
                }
            })
            const presences = await this.prismaService.client.presences_pegawai.findMany({
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
                    hasPresence: presences.some(presence => presence.pegawaiId === sw.id),
                    detailPresence: presences.find(presence => presence.pegawaiId === sw.id) ?? null,
                }
            })

            const allPresences = groups.map(group => {
                const filterPresenceBygroup = checkpegawaiHasPresence.map(presence => {
                    return {
                        id: presence.id,
                        name: presence.name,
                        group: presence.group,
                        position: presence.position,
                        createAt: presence.createdAt,
                        updateAt: presence.updatedAt,
                        hasPresence: presence.hasPresence,
                        detailPresence: presence.detailPresence,
                        gateway: presence.hasPresence ? `${presence.detailPresence.gateway ? presence.detailPresence.gateway.name : '-'}-${presence.detailPresence.gateway ? presence.detailPresence.gateway.location : '-'}` : '-',
                    }
                }).filter(pr => pr.group == group)
                return {
                    [group]: filterPresenceBygroup
                }
            })

            let bufferExcels: { key: string, buffer: any }[] = [];

            allPresences.forEach(daily => {
                const key = Object.keys(daily)[0];
                const mappingPresencesAsJson = daily[key].map(dt => ({
                    Masuk: dt.hasPresence ? dt.detailPresence.enter_time ? format(dt.detailPresence.enter_time, 'dd/MM/yyyy HH:mm:ss', {
                        locale: id
                    }) : '-' : '-',
                    Keluar: dt.hasPresence ? dt.detailPresence.exit_time ? format(dt.detailPresence.exit_time, 'dd/MM/yyyy HH:mm:ss', {
                        locale: id
                    }) : '-' : '-',
                    Nama: dt.name,
                    Kelompok: dt.group,
                    Jabatan: dt.position,
                    Status: dt.hasPresence ? "Presensi" : "Tidak Presensi",
                    Session: session.name,
                    Gateway: dt.hasPresence ? `${dt.detailPresence.gateway ? dt.detailPresence.gateway.name : '-'}-${dt.detailPresence.gateway ? dt.detailPresence.gateway.location : '-'}` : '-',
                }))
                const worksheet = xlsx.utils.json_to_sheet(mappingPresencesAsJson);
                const workbook = xlsx.utils.book_new();
                xlsx.utils.book_append_sheet(workbook, worksheet, `daily-presences-${key}`);
                const buffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });
                bufferExcels.push({
                    key,
                    buffer
                })
            })

            const zip = new JSZip();
            bufferExcels.forEach(buffer => {
                zip.file(`${buffer.key}.xlsx`, buffer.buffer, { binary: true });
            })

            return zip.generateAsync({ type: 'nodebuffer' });
        }
    }


    async findAllPresenceByMonthClass(sessionId: string, date?: string, group?: string) {
        const groups = await this.pegawaiService.getGroup();
        if (groups.includes(group)) {
            const parseDateYearMonth = validateAndFormatDateYear(date);
            if (!parseDateYearMonth) {
                throw new BadRequestException("date invalid")
            }

            const startDate = startOfMonth(new Date(parseInt(parseDateYearMonth.year), parseInt(parseDateYearMonth.month) - 1));
            const endDate = endOfMonth(new Date(parseInt(parseDateYearMonth.year), parseInt(parseDateYearMonth.month) - 1));
            const dateInterval = eachDayOfInterval({
                start: startDate, end: endDate
            })

            const session = await this.prismaService.client.presence_sessions.findUniqueOrThrow({
                where: {
                    id: parseInt(sessionId)
                }
            })

            const presences = await this.prismaService.client.presences_pegawai.findMany({
                where: {
                    presence_sessionsId: session.id,
                    createdAt: {
                        gte: startDate,
                        lte: endDate
                    }
                }
            })

            const pegawai = await this.prismaService.client.pegawai.findMany({
                where: {
                    group
                },
                orderBy: {
                    name: 'asc'
                }
            })


            const mappingPresences = pegawai.map(s => {
                return {
                    name: s.name,
                    presences: dateInterval.map(d => {
                        return {
                            [format(d, "dd")]: presences.find(presence => presence.pegawaiId === s.id && format(presence.createdAt, 'yyyy-MM-dd') === format(d, "yyyy-MM-dd")) ?? null
                        }
                    })
                }
            })
            return {
                date: {
                    startDate,
                    endDate
                },
                presences: mappingPresences
            }

        } else {
            throw new BadRequestException("group not found")
        }
    }
    async exportPresenceByMonthClass(sessionId: string, date?: string, group?: string) {
        const groups = await this.pegawaiService.getGroup();
        if (groups.includes(group)) {
            const parseDateYearMonth = validateAndFormatDateYear(date);
            if (!parseDateYearMonth) {
                throw new BadRequestException("date invalid")
            }

            const startDate = startOfMonth(new Date(parseInt(parseDateYearMonth.year), parseInt(parseDateYearMonth.month) - 1));
            const endDate = endOfMonth(new Date(parseInt(parseDateYearMonth.year), parseInt(parseDateYearMonth.month) - 1));
            const dateInterval = eachDayOfInterval({
                start: startDate, end: endDate
            })

            const session = await this.prismaService.client.presence_sessions.findUniqueOrThrow({
                where: {
                    id: parseInt(sessionId)
                }
            })

            const presences = await this.prismaService.client.presences_pegawai.findMany({
                where: {
                    presence_sessionsId: session.id,
                    createdAt: {
                        gte: startDate,
                        lte: endDate
                    }
                }
            })

            const pegawai = await this.prismaService.client.pegawai.findMany({
                where: {
                    group
                },
                orderBy: {
                    name: 'asc'
                }
            })

            const transformedData = pegawai.map((s) => {
                const transformed = new Map();
                // transformed["Nama"] = s.name;
                transformed.set("Nama", s.name)
                dateInterval.forEach((d) => {
                    const dt = presences.find(presence => presence.pegawaiId === s.id && format(presence.createdAt, 'yyyy-MM-dd') === format(d, "yyyy-MM-dd"));
                    transformed.set(`-${parseInt(format(d, "dd"))}-`, dt ? `${format(dt.enter_time, 'HH:mm:ss', { locale: id })}${dt.exit_time ? `- ` + format(dt.exit_time, 'HH:mm:ss', { locale: id }) : ''}` : "-");
                });

                return Object.fromEntries(transformed)
            });


            const worksheet = xlsx.utils.json_to_sheet(transformedData);
            const workbook = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(workbook, worksheet, 'Presences-' + `${group}-` + date);
            const buffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });
            return buffer;
        } else {
            throw new BadRequestException()
        }

    }

    async findByMeetingSession(
        meetingSessionId: string,
    ) {
        const meetingSession = await this.prismaService.client.meeting_sessions.findUniqueOrThrow({
            where: {
                id: parseInt(meetingSessionId)
            },
            include: {
                presence_sessions: true
            }
        })

        const presences = await this.prismaService.client.presences_pegawai.findMany({
            where: {
                meeting_sessionsId: meetingSession.id,
            }
        })

        const pegawai = await this.prismaService.client.pegawai.findMany({
            orderBy: {
                name: 'asc'
            },
        })

        let mappingPresences = [];
        if (meetingSession.presence_sessions && meetingSession.presence_sessions.group && JSON.parse(meetingSession.presence_sessions.group).length > 0) {
            const groups = JSON.parse(meetingSession.presence_sessions.group)
            mappingPresences = pegawai.filter(pg => groups.includes(pg.group)).map(pg => {
                const getPresence = presences.find(presence => presence.pegawaiId === pg.id);
                return {
                    name: pg.name,
                    username: pg.username,
                    sign_picture: getPresence ? pg.sign_picture : null,
                    isPresence: getPresence ? true : false

                }
            })
        } else {
            mappingPresences = pegawai.map(pg => {
                const getPresence = presences.find(presence => presence.pegawaiId === pg.id);
                return {
                    name: pg.name,
                    username: pg.username,
                    sign_picture: getPresence ? pg.sign_picture : null,
                    isPresence: getPresence ? true : false
                }
            })
        }

        return mappingPresences;

    }

    async getAllPresenceByAutoReadAndLocation(date?: string) {

        const parseDateYearMonth = validateAndFormatDateYear(date);
        if (!parseDateYearMonth) {
            throw new BadRequestException("date invalid")
        }

        const startDate = startOfMonth(new Date(parseInt(parseDateYearMonth.year), parseInt(parseDateYearMonth.month) - 1));
        const endDate = endOfMonth(new Date(parseInt(parseDateYearMonth.year), parseInt(parseDateYearMonth.month) - 1));
        const dateInterval = eachDayOfInterval({
            start: startDate, end: endDate
        })

        const session = await this.prismaService.client.presence_sessions.findFirst({
            where: {
                session_role_type: 'PEGAWAI',
                auto_read_presence: true,
                start_time: {
                    not: null
                },
                end_time: {
                    not: null
                }
            },
            include: {
                presence_sessions_by_location: true
            }
        })

        if (!(session && session.presence_sessions_by_location)) throw new BadRequestException("session not found")

        const presences = await this.prismaService.client.presences_pegawai.findMany({
            where: {
                presence_sessionsId: session.id,
                createdAt: {
                    gte: startDate,
                    lte: endDate
                }
            }
        })

        const pegawai = await this.prismaService.client.pegawai.findMany({
            orderBy: {
                name: 'asc'
            }
        })

        if (!session.start_time && !session.end_time) throw new BadRequestException("session start time and end time not found")
        const now = format(Date.now(), "yyyy-MM-dd");

        const parseStartTime = format(
            `${now} ${session.start_time}`,
            "yyyy-MM-dd HH: mm: ss"
        );
        const leaves = await this.prismaService.client.leave_requests.findMany({
            where: {
                pegawaiId: {
                    in: pegawai.map(pg => pg.id),
                },
                status: 'Approved',
                createdAt: {
                    gte: startDate,
                    lte: endDate
                }
            }
        })

        const mappingPresences = pegawai.map(s => {
            return {
                name: s.name,
                presences: dateInterval.map(d => {
                    const findPresence = presences.find(presence => presence.pegawaiId === s.id && format(presence.createdAt, 'yyyy-MM-dd') === format(d, "yyyy-MM-dd"));
                    const findLeave = leaves.find(leave => leave.pegawaiId === s.id && format(leave.createdAt, 'yyyy-MM-dd') === format(d, "yyyy-MM-dd"));
                    return {
                        [format(d, "dd")]: findPresence ? {
                            enter_time: findPresence.enter_time ? format(findPresence.enter_time, 'HH:mm:ss', {
                                locale: id
                            }) : '-',
                            exit_time: findPresence.exit_time ? format(findPresence.exit_time, 'HH:mm:ss', {
                                locale: id
                            }) : '-',
                            isLate: isAfter(new Date(findPresence.enter_time), parseStartTime) ? true : false,
                        } : findLeave ? {
                            isLeave: true,
                        } : null
                    }
                })
            }
        })
        return {
            date: {
                startDate,
                endDate
            },
            presences: mappingPresences
        }

    }
}