import { BadRequestException, Inject, Injectable, ServiceUnavailableException, UnauthorizedException } from "@nestjs/common";
import { format, isAfter } from "date-fns";
import { CustomPrismaService } from "nestjs-prisma";
import { ExtendedPrismaClient } from "src/prisma.extension";
import { PresenceLocationDto } from "../dto/presence.dto";
import { isWithinRange } from "src/utils/location";
import { id } from "date-fns/locale";

@Injectable()
export class PegawaiModulesPresenceService {
    constructor(
        @Inject('PrismaService') private prismaService: CustomPrismaService<ExtendedPrismaClient>,

    ) { }
    async findAll(user: any, limit: string, after: string, before: string, search: string) {
        if (!user) return {}

        const presences = await this.prismaService.client.presences_pegawai.paginate({
            where: {
                pegawaiId: parseInt(user.sub),
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
                meeting_session: true,
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

        const presence = await this.prismaService.client.presences_pegawai.findUniqueOrThrow({
            where: {
                id: parseInt(id),
                pegawaiId: parseInt(user.sub)
            },
            include: {
                session: true,
                meeting_session: true,
                gateway: {
                    select: {
                        location: true
                    }
                }
            },
        })

        return presence
    }

    async readCurrentSessionAndPresence(user: any) {
        if (!user) throw new UnauthorizedException()
        const userId = parseInt(user.sub);


        const pegawai = await this.prismaService.client.pegawai.findUnique({
            where: {
                id: userId
            }
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

        if (!session) throw new ServiceUnavailableException()
        const location = session.presence_sessions_by_location

        if (!location) throw new ServiceUnavailableException()

        const presence = await this.prismaService.client.presences_pegawai.findFirst({
            where: {
                pegawaiId: pegawai.id,
                presence_sessionsId: session.id,
                createdAt: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0))
                },
                method: "location",
            }
        })

        return {
            session,
            presence
        }
    }

    async createPresenceByLocation(user: any, presenceLocationDto: PresenceLocationDto) {
        return await this.prismaService.client.$transaction(async (tx) => {
            if (!user) throw new UnauthorizedException()
            const userId = parseInt(user.sub);


            const pegawai = await tx.pegawai.findUnique({
                where: {
                    id: userId
                }
            })

            const session = await tx.presence_sessions.findFirst({
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

            if (!session) throw new ServiceUnavailableException()
            const location = session.presence_sessions_by_location

            if (!location) throw new ServiceUnavailableException()

            if (isWithinRange({
                latitude: location.latitude,
                longitude: location.longitude
            }, {
                latitude: presenceLocationDto.latitude,
                longitude: presenceLocationDto.longitude
            }, location.distance)) {
                const checkPresence = await tx.presences_pegawai.findFirst({
                    where: {
                        pegawaiId: pegawai.id,
                        presence_sessionsId: session.id,
                        enter_time: {
                            gte: new Date(new Date().setHours(0, 0, 0, 0))
                        },
                        method: "location"
                    }
                })

                if (checkPresence) {
                    if (session.allow_twice) {
                        const checkPresenceHaveExitTime = await tx.presences_pegawai.findFirst({
                            where: {
                                pegawaiId: pegawai.id,
                                presence_sessionsId: session.id,
                                enter_time: {
                                    gte: new Date(new Date().setHours(0, 0, 0, 0))
                                },
                                exit_time: {
                                    gte: new Date(new Date().setHours(0, 0, 0, 0))
                                },
                                method: 'location'
                            }
                        })

                        if (checkPresenceHaveExitTime) {
                            throw new BadRequestException("Presensi Anda Sudah Lengkap")
                        } else {
                            const parseGroup = session.group ? JSON.parse(session.group) : [];
                            if (parseGroup.length > 0) {
                                if (!parseGroup.includes(pegawai.group)) {
                                    throw new BadRequestException("ANDA TIDAK DIIZINKAN PRESENSI")
                                }
                            }
                            const current_time = format(new Date(), 'yyyy-MM-dd HH:mm:ss', { locale: id });
                            const now = format(Date.now(), "yyyy-MM-dd", { locale: id });
                            const parseEndTime = format(`${now} ${session.end_time}`, 'yyyy-MM-dd HH:mm:ss', { locale: id });
                            if (isAfter(current_time, parseEndTime)) {
                                const updateExitTime = await tx.presences_pegawai.update({
                                    where: {
                                        id: checkPresence.id,
                                    },
                                    data: {
                                        exit_time: new Date()
                                    },
                                })
                                return updateExitTime
                            } else {
                                throw new BadRequestException(`Presensi Pulang Dimulai Pukul ${parseEndTime.split(" ")[1]}`)
                            }
                        }
                    } else {
                        throw new BadRequestException("Presensi Anda Sudah Lengkap")
                    }
                } else {
                    const parseGroup = session.group ? JSON.parse(session.group) : [];
                    if (parseGroup.length > 0) {
                        if (!parseGroup.includes(pegawai.group)) {
                            throw new BadRequestException("ANDA TIDAK DIIZINKAN PRESENSI")
                        }
                    }

                    const createPresenceEnter = await tx.presences_pegawai.create({
                        data: {
                            presence_sessionsId: session.id,
                            pegawaiId: pegawai.id,
                            enter_time: new Date(),
                            method: 'location',
                        },
                    })

                    return createPresenceEnter;
                }

            } else {
                throw new BadRequestException("Lokasi Tidak Sesuai Dengan Titik Koordinat")
            }
        })

    }
}