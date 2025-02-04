import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { gateways, pegawai, presence_sessions, PresenceMethod, presences, presences_pegawai, siswa } from '@prisma/client';
import { eachDayOfInterval, endOfDay, endOfMonth, format, isAfter, isBefore, parse, startOfDay, startOfMonth } from 'date-fns';
import { id } from 'date-fns/locale';
import { CustomPrismaService } from 'nestjs-prisma';
import { Server } from 'socket.io';
import { ScannedDto } from 'src/gateways/dto/scanned.dto';
import { ExtendedPrismaClient } from 'src/prisma.extension';
import { SiswaService } from 'src/siswa/siswa.service';
import { isJSON, isValidDateString, validateAndFormatDateYear, validateDateRange } from 'src/utils/helpers';
import * as xlsx from 'xlsx';
// import { CreatePresenceByNisDto } from './dto/create-presence.dto';
import * as JSZip from 'jszip';
type FilterDate = {
  start_date?: string,
  end_date?: string
}

@Injectable()
export class PresenceService {
  constructor(
    private readonly siswaService: SiswaService,
    @Inject('PrismaService') private prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) { }

  async createPresenceByScanned(scanned: ScannedDto, gateway: gateways, client: Server): Promise<presences | presences_pegawai> {

    if (gateway.presence_sessionsId) {
      // presence
      const session = await this.prismaService.client.presence_sessions.findUnique({
        where: {
          id: gateway.presence_sessionsId,
        }
      })

      if (!session) {
        throw new NotFoundException("SESI TIDAK DITEMUKAN")
      }

      // presence siswa
      if (session.session_role_type === 'SISWA') {
        const siswa = await this.prismaService.client.siswa.findUnique({
          where: {
            rfid_token: scanned.scan
          },
        })

        if (!siswa) throw new NotFoundException("KARTU TDK TERDAFTAR");

        const now = format(Date.now(), "yyyy-MM-dd");
        const current_time = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
        // check session have start_time and end_time
        // range check
        if (session.start_time && session.end_time) {
          const parseStartTime = format(`${now} ${session.start_time}`, 'yyyy-MM-dd HH:mm:ss');
          const parseEndTime = format(`${now} ${session.end_time}`, 'yyyy-MM-dd HH:mm:ss');
          if (isAfter(current_time, parseStartTime) && isBefore(current_time, parseEndTime)) {
            return await this.createPresence({
              gateway,
              session,
              siswa,
              client,
              method: 'card'
            })
          } else {
            this.handlingPresenceError({
              error: `Presensi Mulai pada ${format(parseStartTime, 'HH:mm:ss', {
                locale: id
              })} dan Selesai pada ${format(parseEndTime, 'HH:mm:ss', {
                locale: id
              })}`,
              siswa
            })
          }
          // start time check
        } else if (session.start_time) {
          const parseStartTime = format(`${now} ${session.start_time}`, 'yyyy-MM-dd HH:mm:ss');
          if (isAfter(current_time, parseStartTime)) {
            return await this.createPresence({
              gateway,
              session,
              siswa,
              client,
              method: 'card'
            })
          } else {
            this.handlingPresenceError({
              error: `Presensi Mulai pada ${format(parseStartTime, 'HH:mm:ss', {
                locale: id
              })}`,
              siswa
            })
          }
          // end time check
        } else if (session.end_time) {
          const parseEndTime = format(`${now} ${session.end_time}`, 'yyyy-MM-dd HH:mm:ss');
          if (isBefore(current_time, parseEndTime)) {
            return await this.createPresence({
              gateway,
              session,
              siswa,
              client,
              method: 'card'

            })
          } else {
            this.handlingPresenceError({
              error: `Presensi Sudah Selesai pada ${format(parseEndTime, 'HH:mm:ss', {
                locale: id
              })}`,
              siswa
            })
          }

        } else {
          // ignore some session start and end times
          return await this.createPresence({
            gateway,
            session,
            siswa,
            client,
            method: 'card'
          })
        }
        // presence pegawai
      } else if (session.session_role_type === 'PEGAWAI') {
        const pegawai = await this.prismaService.client.pegawai.findUnique({
          where: {
            rfid_token: scanned.scan
          },
        })

        if (!pegawai) throw new NotFoundException("KARTU TDK TERDAFTAR");

        const now = format(Date.now(), "yyyy-MM-dd");
        const current_time = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
        // check session have start_time and end_time
        // range check
        if (session.start_time && session.end_time) {
          const parseStartTime = format(`${now} ${session.start_time}`, 'yyyy-MM-dd HH:mm:ss');
          const parseEndTime = format(`${now} ${session.end_time}`, 'yyyy-MM-dd HH:mm:ss');
          if (isAfter(current_time, parseStartTime) && isBefore(current_time, parseEndTime)) {
            return await this.createPresencePegawai({
              gateway,
              session,
              pegawai,
              client,
              method: 'card'
            })
          } else {
            this.handlingPresenceErrorPegawai({
              error: `Presensi Mulai pada ${format(parseStartTime, 'HH:mm:ss', {
                locale: id
              })} dan Selesai pada ${format(parseEndTime, 'HH:mm:ss', {
                locale: id
              })}`,
              pegawai
            })
          }
          // start time check
        } else if (session.start_time) {
          const parseStartTime = format(`${now} ${session.start_time}`, 'yyyy-MM-dd HH:mm:ss');
          if (isAfter(current_time, parseStartTime)) {
            return await this.createPresencePegawai({
              gateway,
              session,
              pegawai,
              client,
              method: 'card'
            })
          } else {
            this.handlingPresenceErrorPegawai({
              error: `Presensi Mulai pada ${format(parseStartTime, 'HH:mm:ss', {
                locale: id
              })}`,
              pegawai
            })
          }
          // end time check
        } else if (session.end_time) {
          const parseEndTime = format(`${now} ${session.end_time}`, 'yyyy-MM-dd HH:mm:ss');
          if (isBefore(current_time, parseEndTime)) {
            return await this.createPresencePegawai({
              gateway,
              session,
              pegawai,
              client,
              method: 'card'

            })
          } else {
            this.handlingPresenceErrorPegawai({
              error: `Presensi Sudah Selesai pada ${format(parseEndTime, 'HH:mm:ss', {
                locale: id
              })}`,
              pegawai
            })
          }

        } else {
          // ignore some session start and end times
          return await this.createPresencePegawai({
            gateway,
            session,
            pegawai,
            client,
            method: 'card'
          })
        }
      }
    } else {
      this.handlingPresenceErrorPegawai({
        error: "GATEWAY TDK DITEMUKAN",
        pegawai: null
      })
    }
  }

  protected async createPresence({
    gateway,
    session,
    siswa,
    client,
    method
  }: {
    siswa: siswa,
    gateway?: gateways,
    client?: Server,
    session: presence_sessions,
    method: PresenceMethod
  }): Promise<presences> {
    return await this.prismaService.client.$transaction(async (tx) => {
      if (session.allow_twice) {
        const checkPresence = await tx.presences.findFirst({
          where: {
            siswaId: siswa.id,
            presence_sessionsId: session.id,
            enter_time: {
              gte: new Date(new Date().setHours(0, 0, 0, 0))
            },
            // method
          }
        })

        if (checkPresence) {
          const checkPresenceHaveExitTime = await tx.presences.findFirst({
            where: {
              siswaId: siswa.id,
              presence_sessionsId: session.id,
              enter_time: {
                gte: new Date(new Date().setHours(0, 0, 0, 0))
              },
              exit_time: {
                gte: new Date(new Date().setHours(0, 0, 0, 0))
              },
              // method
            }
          })
          if (checkPresenceHaveExitTime) {
            this.handlingPresenceError({
              error: `ANDA SUDAH PRESENSI`,
              siswa
            })
          } else {
            // validate by rombel
            const parseRombel = session.group ? JSON.parse(session.group) : [];
            if (parseRombel.length > 0) {
              if (!parseRombel.includes(siswa.rombel)) {
                this.handlingPresenceError({
                  error: `ANDA TIDAK DAPAT PRESENSI DI ROMBEL INI`,
                  siswa
                })
              }
            }
            // update the exit_time
            const updateExitTime = await tx.presences.update({
              where: {
                id: checkPresence.id,
              },
              data: {
                exit_time: new Date()
              },
              include: {
                gateway: true,
                siswa: true
              }
            })
            return updateExitTime
          }

        } else {
          // validate by rombel
          const parseRombel = session.group ? JSON.parse(session.group) : [];
          if (parseRombel.length > 0) {
            if (!parseRombel.includes(siswa.rombel)) {
              this.handlingPresenceError({
                error: `ANDA TIDAK DAPAT PRESENSI DI ROMBEL INI`,
                siswa
              })
            }
          }
          const createPresenceEnter = await tx.presences.create({
            data: {
              presence_sessionsId: session.id,
              siswaId: siswa.id,
              ...gateway && {
                gatewaysId: gateway.id,
              },
              enter_time: new Date(),
              method,
            },
            include: {
              gateway: true,
              siswa: true
            }
          })

          return createPresenceEnter;
        }
      } else {
        const checkPresence = await tx.presences.findFirst({
          where: {
            siswaId: siswa.id,
            presence_sessionsId: session.id,
            ...gateway && {
              gatewaysId: gateway.id,
            },
            enter_time: {
              gte: new Date(new Date().setHours(0, 0, 0, 0))
            },
            // method
          }
        })

        if (checkPresence) {
          this.handlingPresenceError({
            error: `ANDA SUDAH PRESENSI`,
            siswa
          })
        } else {
          // validate by rombel
          const parseRombel = session.group ? JSON.parse(session.group) : [];
          if (parseRombel.length > 0) {
            if (!parseRombel.includes(siswa.rombel)) {
              this.handlingPresenceError({
                error: `ANDA TIDAK DAPAT PRESENSI DI ROMBEL INI`,
                siswa
              })
            }
          }
          const createPresence = await tx.presences.create({
            data: {
              presence_sessionsId: session.id,
              siswaId: siswa.id,
              ...gateway && {
                gatewaysId: gateway.id,
              },
              enter_time: new Date(),
              method,
            },
            include: {
              gateway: true,
              siswa: true
            }
          })
          return createPresence;
        }
      }
    })
  }
  protected async createPresencePegawai({
    gateway,
    session,
    pegawai,
    client,
    method
  }: {
    pegawai: pegawai,
    gateway?: gateways,
    client?: Server,
    session: presence_sessions,
    method: PresenceMethod
  }): Promise<presences_pegawai> {
    return await this.prismaService.client.$transaction(async (tx) => {
      if (session.allow_twice) {
        const checkPresence = await tx.presences_pegawai.findFirst({
          where: {
            pegawaiId: pegawai.id,
            presence_sessionsId: session.id,
            enter_time: {
              gte: new Date(new Date().setHours(0, 0, 0, 0))
            },
            // method
          }
        })

        if (checkPresence) {
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
              // method
            }
          })
          if (checkPresenceHaveExitTime) {
            this.handlingPresenceErrorPegawai({
              error: `ANDA SUDAH PRESENSI`,
              pegawai
            })
          } else {
            // validate by rombel
            const parseRombel = session.group ? JSON.parse(session.group) : [];
            if (parseRombel.length > 0) {
              if (!parseRombel.includes(pegawai.group)) {
                this.handlingPresenceErrorPegawai({
                  error: `ANDA TIDAK DAPAT PRESENSI DI KELOMPOK INI`,
                  pegawai
                })
              }
            }
            // update the exit_time
            const updateExitTime = await tx.presences_pegawai.update({
              where: {
                id: checkPresence.id,
              },
              data: {
                exit_time: new Date()
              },
              include: {
                gateway: true,
                pegawai: true
              }
            })
            return updateExitTime
          }

        } else {
          // validate by rombel
          const parseRombel = session.group ? JSON.parse(session.group) : [];
          if (parseRombel.length > 0) {
            if (!parseRombel.includes(pegawai.group)) {
              this.handlingPresenceErrorPegawai({
                error: `ANDA TIDAK DAPAT PRESENSI DI KELOMPOK INI`,
                pegawai
              })
            }
          }
          const createPresenceEnter = await tx.presences_pegawai.create({
            data: {
              presence_sessionsId: session.id,
              pegawaiId: pegawai.id,
              ...gateway && {
                gatewaysId: gateway.id,
              },
              enter_time: new Date(),
              method,
            },
            include: {
              gateway: true,
              pegawai: true
            }
          })

          return createPresenceEnter;
        }
      } else {
        const checkPresence = await tx.presences_pegawai.findFirst({
          where: {
            pegawaiId: pegawai.id,
            presence_sessionsId: session.id,
            ...gateway && {
              gatewaysId: gateway.id,
            },
            enter_time: {
              gte: new Date(new Date().setHours(0, 0, 0, 0))
            },
            // method
          }
        })

        if (checkPresence) {
          this.handlingPresenceErrorPegawai({
            error: `ANDA SUDAH PRESENSI`,
            pegawai
          })
        } else {
          // validate by rombel
          const parseRombel = session.group ? JSON.parse(session.group) : [];
          if (parseRombel.length > 0) {
            if (!parseRombel.includes(pegawai.group)) {
              this.handlingPresenceErrorPegawai({
                error: `ANDA TIDAK DAPAT PRESENSI DI KELOMPOK INI`,
                pegawai
              })
            }
          }
          const createPresence = await tx.presences_pegawai.create({
            data: {
              presence_sessionsId: session.id,
              pegawaiId: pegawai.id,
              ...gateway && {
                gatewaysId: gateway.id,
              },
              enter_time: new Date(),
              method,
            },
            include: {
              gateway: true,
              pegawai: true
            }
          })
          return createPresence;
        }
      }
    })
  }


  protected handlingPresenceError({
    error,
    siswa
  }: { error: any, siswa?: siswa }): Error {
    throw new Error(JSON.stringify({ error, siswa }))
  }

  protected handlingPresenceErrorPegawai({
    error,
    pegawai
  }: { error: any, pegawai: pegawai }): Error {
    throw new Error(JSON.stringify({ error, pegawai }))
  }


  async findAllPresenceToday({ sessionId }: {
    sessionId: string,
  }) {

    const session = await this.prismaService.client.presence_sessions.findUniqueOrThrow({
      where: {
        id: parseInt(sessionId)
      }
    })

    if (session.session_role_type === "SISWA") {
      return await this.prismaService.client.presences.findMany({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          },
          presence_sessionsId: session.id,
        },
        orderBy: {
          createdAt: 'desc'
        },
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
      })
    } else if (session.session_role_type === 'PEGAWAI') {
      return await this.prismaService.client.presences_pegawai.findMany({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          },
          presence_sessionsId: session.id,
        },
        orderBy: {
          createdAt: 'desc'
        },
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
      })
    }

  }


  async findAll(
    sessionId: string,
    page?: number,
    limit?: number,
    search?: string,
    date?: string
  ) {

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

  async exportData(
    sessionId: string,
    search?: string,
    date?: string
  ) {

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

    const presences = await this.prismaService.client.presences.findMany({
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
    })

    const mappingPresences = presences.map(presence => ({
      Masuk: presence.enter_time ? format(presence.enter_time, 'dd/MM/yyyy HH:mm:sss', {
        locale: id
      }) : '-',
      Keluar: presence.exit_time ? format(presence.exit_time, 'dd/MM/yyyy HH:mm:sss', {
        locale: id
      }) : '-',
      Nama: presence.siswa.name,
      NISN: presence.siswa.nisn,
      NIS: presence.siswa.nis,
      Rombel: presence.siswa.rombel,
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
    rombel?: string
  ) {
    const rombels = await this.siswaService.getGroupClass();
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

    if (rombel) {
      if (rombels.includes(rombel)) {
        const siswa = await this.prismaService.client.siswa.findMany({
          select: {
            id: true,
            name: true,
            rombel: true,
            createdAt: true,
            updatedAt: true,
          },
          where: {
            rombel: {
              equals: rombel
            }
          },
          orderBy: {
            name: 'asc'
          }
        })

        const presences = await this.prismaService.client.presences.findMany({
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

        const checkSiswaHasPresence = siswa.map(sw => {
          return {
            ...sw,
            hasPresence: presences.some(presence => presence.siswaId === sw.id),
            detailPresence: presences.find(presence => presence.siswaId === sw.id) ?? null,
          }
        })

        return {
          rombel,
          presences: checkSiswaHasPresence.map(presence => {
            return {
              id: presence.id,
              name: presence.name,
              rombel: presence.rombel,
              createAt: presence.createdAt,
              updateAt: presence.updatedAt,
              hasPresence: presence.hasPresence,
              detailPresence: presence.detailPresence,
              gateway: presence.hasPresence ? `${presence.detailPresence.gateway.name}-${presence.detailPresence.gateway.location}` : '-',
            }
          })
        }
      } else {
        throw new NotFoundException("Rombel Invalid")
      }
    } else {
      const siswa = await this.prismaService.client.siswa.findMany({
        select: {
          id: true,
          name: true,
          rombel: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          name: 'asc'
        }
      })
      const presences = await this.prismaService.client.presences.findMany({
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


      const checkSiswaHasPresence = siswa.map(sw => {
        return {
          ...sw,
          hasPresence: presences.some(presence => presence.siswaId === sw.id),
          detailPresence: presences.find(presence => presence.siswaId === sw.id) ?? null,
        }
      })


      return {
        rombel: null,
        presences: rombels.map(rombel => {
          const filterPresenceByRombel = checkSiswaHasPresence.map(presence => {
            return {
              id: presence.id,
              name: presence.name,
              rombel: presence.rombel,
              createAt: presence.createdAt,
              updateAt: presence.updatedAt,
              hasPresence: presence.hasPresence,
              detailPresence: presence.detailPresence,
              gateway: presence.hasPresence ? `${presence.detailPresence.gateway.name}-${presence.detailPresence.gateway.location}` : '-',
            }
          }).filter(pr => pr.rombel == rombel)
          return {
            [rombel]: filterPresenceByRombel
          }
        })
      }
    }

  }

  async exportByDaily(
    sessionId: string,
    search?: string,
    date?: string,
    rombel?: string
  ) {
    const rombels = await this.siswaService.getGroupClass();
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

    if (rombel) {
      if (rombels.includes(rombel)) {

        const siswa = await this.prismaService.client.siswa.findMany({
          select: {
            id: true,
            name: true,
            rombel: true,
            nis: true,
            nisn: true,
            createdAt: true,
            updatedAt: true,
          },
          where: {
            rombel: {
              equals: rombel
            }
          },
          orderBy: {
            name: 'asc'
          }
        })

        const presences = await this.prismaService.client.presences.findMany({
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

        const checkSiswaHasPresence = siswa.map(sw => {
          return {
            ...sw,
            hasPresence: presences.some(presence => presence.siswaId === sw.id),
            detailPresence: presences.find(presence => presence.siswaId === sw.id) ?? null,
          }
        })


        const mappingPresences = checkSiswaHasPresence.map(presence => ({
          Masuk: presence.hasPresence ? presence.detailPresence.enter_time ? format(presence.detailPresence.enter_time, 'dd/MM/yyyy HH:mm:sss', {
            locale: id
          }) : '-' : '-',
          Keluar: presence.hasPresence ? presence.detailPresence.exit_time ? format(presence.detailPresence.exit_time, 'dd/MM/yyyy HH:mm:sss', {
            locale: id
          }) : '-' : '-',
          Nama: presence.name,
          NISN: presence.nisn,
          NIS: presence.nis,
          Rombel: presence.rombel,
          Status: presence.hasPresence ? "Presensi" : "Tidak Presensi",
          Session: session.name,
          Gateway: presence.hasPresence ? `${presence.detailPresence.gateway.name}-${presence.detailPresence.gateway.location}` : '-',
        }))


        const worksheet = xlsx.utils.json_to_sheet(mappingPresences);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Presences');
        const buffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });
        return buffer;
      } else {
        throw new BadRequestException("rombel invalid")
      }
    } else {
      const siswa = await this.prismaService.client.siswa.findMany({
        select: {
          id: true,
          name: true,
          rombel: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          name: 'asc'
        }
      })
      const presences = await this.prismaService.client.presences.findMany({
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


      const checkSiswaHasPresence = siswa.map(sw => {
        return {
          ...sw,
          hasPresence: presences.some(presence => presence.siswaId === sw.id),
          detailPresence: presences.find(presence => presence.siswaId === sw.id) ?? null,
        }
      })

      const allPresences = rombels.map(rombel => {
        const filterPresenceByRombel = checkSiswaHasPresence.map(presence => {
          return {
            id: presence.id,
            name: presence.name,
            rombel: presence.rombel,
            createAt: presence.createdAt,
            updateAt: presence.updatedAt,
            hasPresence: presence.hasPresence,
            detailPresence: presence.detailPresence,
            gateway: presence.hasPresence ? `${presence.detailPresence.gateway.name}-${presence.detailPresence.gateway.location}` : '-',
          }
        }).filter(pr => pr.rombel == rombel)
        return {
          [rombel]: filterPresenceByRombel
        }
      })

      let bufferExcels: { key: string, buffer: any }[] = [];

      allPresences.forEach(daily => {
        const key = Object.keys(daily)[0];
        const mappingPresencesAsJson = daily[key].map(dt => ({
          Masuk: dt.hasPresence ? dt.detailPresence.enter_time ? format(dt.detailPresence.enter_time, 'dd/MM/yyyy HH:mm:sss', {
            locale: id
          }) : '-' : '-',
          Keluar: dt.hasPresence ? dt.detailPresence.exit_time ? format(dt.detailPresence.exit_time, 'dd/MM/yyyy HH:mm:sss', {
            locale: id
          }) : '-' : '-',
          Nama: dt.name,
          NISN: dt.nisn,
          NIS: dt.nis,
          Rombel: dt.rombel,
          Status: dt.hasPresence ? "Presensi" : "Tidak Presensi",
          Session: session.name,
          Gateway: dt.hasPresence ? `${dt.detailPresence.gateway.name}-${dt.detailPresence.gateway.location}` : '-',
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

  async findAllPresenceByMonthClass(sessionId: string, date?: string, rombel?: string) {
    const rombels = await this.siswaService.getGroupClass();
    if (rombels.includes(rombel)) {
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

      const presences = await this.prismaService.client.presences.findMany({
        where: {
          presence_sessionsId: session.id,
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        }
      })

      const siswa = await this.prismaService.client.siswa.findMany({
        where: {
          rombel
        },
        orderBy: {
          name: 'asc'
        }
      })


      const mappingPresences = siswa.map(s => {
        return {
          name: s.name,
          presences: dateInterval.map(d => {
            return {
              [format(d, "dd")]: presences.find(presence => presence.siswaId === s.id && format(presence.createdAt, 'yyyy-MM-dd') === format(d, "yyyy-MM-dd")) ?? null
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
  async exportPresenceByMonthClass(sessionId: string, date?: string, rombel?: string) {
    const rombels = await this.siswaService.getGroupClass();
    if (rombels.includes(rombel)) {
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

      const presences = await this.prismaService.client.presences.findMany({
        where: {
          presence_sessionsId: session.id,
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        }
      })

      const siswa = await this.prismaService.client.siswa.findMany({
        where: {
          rombel
        },
        orderBy: {
          name: 'asc'
        }
      })

      const transformedData = siswa.map((s) => {
        const transformed = new Map();
        // transformed["Nama"] = s.name;
        transformed.set("Nama", s.name)
        dateInterval.forEach((d) => {
          const dt = presences.find(presence => presence.siswaId === s.id && format(presence.createdAt, 'yyyy-MM-dd') === format(d, "yyyy-MM-dd"));
          transformed.set(`-${parseInt(format(d, "dd"))}-`, dt ? `${format(dt.enter_time, 'HH:mm:ss', { locale: id })}${dt.exit_time ? `- ` + format(dt.exit_time, 'HH:mm:ss', { locale: id }) : ''}` : "-");
        });

        return Object.fromEntries(transformed)
      });


      const worksheet = xlsx.utils.json_to_sheet(transformedData);
      const workbook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(workbook, worksheet, 'Presences-' + `${rombel}-` + date);
      const buffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });
      return buffer;
    } else {
      throw new BadRequestException()
    }

  }
}
