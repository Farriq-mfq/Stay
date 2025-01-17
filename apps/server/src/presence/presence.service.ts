import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { gateways, presence_sessions, PresenceMethod, presences, siswa } from '@prisma/client';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { CustomPrismaService } from 'nestjs-prisma';
import { Server } from 'socket.io';
import { ScannedDto } from 'src/gateways/dto/scanned.dto';
import { ExtendedPrismaClient } from 'src/prisma.extension';
import { isJSON, isValidDateString, validateDateRange } from 'src/utils/helpers';
import * as xlsx from 'xlsx';
import { CreatePresenceByNisDto } from './dto/create-presence.dto';
import { SiswaService } from 'src/siswa/siswa.service';
import { contains } from 'class-validator';
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
  // async createPresenceByQR(CreatePresenceByQRDTO: CreatePresenceByQRDTO) {
  //   // check the session
  //   const session = await this.prismaService.client.presence_sessions.findUniqueOrThrow({
  //     where: {
  //       id: CreatePresenceByQRDTO.session
  //     }
  //   })

  //   // check the nisn
  //   const siswa = await this.prismaService.client.siswa.findUniqueOrThrow({
  //     where: {
  //       nisn: CreatePresenceByQRDTO.nisn
  //     },
  //     include: {
  //       telegram_account: true
  //     }
  //   })
  //   if (session && siswa) {
  //     // check today already exists
  //     const checkPresenceAlready = await this.prismaService.client.presences.findFirst({
  //       where: {
  //         siswaId: siswa.id,
  //         presence_sessionsId: session.id,
  //         createdAt: {
  //           gte: new Date(new Date().setHours(0, 0, 0, 0))
  //         }
  //       }
  //     })

  //     if (checkPresenceAlready) {
  //       throw new BadRequestException()
  //     }
  //     // create the presence
  //     const presence = await this.prismaService.client.presences.create({
  //       data: {
  //         siswaId: siswa.id,
  //         presence_sessionsId: session.id,
  //         method: 'qrcode'
  //       }
  //     })
  //     if (siswa.telegram_account) {
  //       const htmlContent = `
  //       Terimakasih Telah melakukan presensi dengan detail presensi sebagai berikut :\n\n<strong>Nama:</strong> ${siswa.name}\n<strong>Tanggal:</strong> ${format(new Date(presence.createdAt), 'dd/MM/yyyy HH:mm:ss', { locale: id })}\n<strong>Sesi:</strong> ${session.name}\n<strong>Metode:</strong> QRCode\n\nTerima kasih.
  //       `;
  //       await this.bot.telegram.sendMessage(siswa.telegram_account.chat_id, htmlContent, {
  //         parse_mode: 'HTML'
  //       })
  //     }

  //     return presence
  //   } else {
  //     throw new BadRequestException()
  //   }
  // }

  async createPresenceByNis(createPresenceByNisDto: CreatePresenceByNisDto) {
    const siswa = await this.prismaService.client.siswa.findUnique({
      where: {
        nisn: createPresenceByNisDto.nisn
      },
    })

    if (!siswa) throw new NotFoundException("NISN masih salah");

    const session = await this.prismaService.client.presence_sessions.findUnique({
      where: {
        id: createPresenceByNisDto.session
      }
    })

    if (!session) throw new NotFoundException("Session not found");

    const current_time = new Date();


    if (session.start_time && session.end_time) {
      if (current_time.getTime() >= session.start_time.getTime() && current_time.getTime() <= session.end_time.getTime()) {
        this.createPresence({
          session,
          siswa,
          method: "other"
        })
      } else {
        this.handlingPresenceError({
          error: `Presensi Mulai pada ${format(session.start_time, 'dd/MM/yyyy HH:mm:ss', {
            locale: id
          })} dan Selesai pada ${format(session.end_time, 'dd/MM/yyyy HH:mm:ss', {
            locale: id
          })}`,
          siswa
        })
      }
    } else if (session.end_time) {
      if (current_time >= session.start_time) {
        return await this.createPresence({
          session,
          siswa,
          method: 'other'
        })
      } else {
        this.handlingPresenceError({
          error: `Presensi Mulai pada ${format(session.start_time, 'dd/MM/yyyy HH:mm:ss', {
            locale: id
          })}`,
          siswa
        })
      }
    } else if (session.end_time) {
      if (current_time <= session.end_time) {
        return await this.createPresence({
          session,
          siswa,
          method: 'other'

        })
      } else {
        this.handlingPresenceError({
          error: `Presensi Sudah Selesai pada ${format(session.end_time, 'dd/MM/yyyy HH:mm:ss', {
            locale: id
          })}`,
          siswa
        })
      }

    } else {
      return await this.createPresence({
        session,
        siswa,
        method: 'other'
      })
    }
  }


  async createPresenceByScanned(scanned: ScannedDto, gateway: gateways, client: Server): Promise<presences> {
    const siswa = await this.prismaService.client.siswa.findUnique({
      where: {
        rfid_token: scanned.scan
      },
      include: {
        telegram_account: true
      }
    })


    if (!siswa) throw new NotFoundException("KARTU TDK TERDAFTAR");

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
      const current_time = new Date();
      // check session have start_time and end_time
      // range check
      if (session.start_time && session.end_time) {
        if (current_time.getTime() >= session.start_time.getTime() && current_time.getTime() <= session.end_time.getTime()) {
          return await this.createPresence({
            gateway,
            session,
            siswa,
            client,
            method: 'card'
          })
        } else {
          this.handlingPresenceError({
            error: `Presensi Mulai pada ${format(session.start_time, 'dd/MM/yyyy HH:mm:ss', {
              locale: id
            })} dan Selesai pada ${format(session.end_time, 'dd/MM/yyyy HH:mm:ss', {
              locale: id
            })}`,
            siswa
          })
        }
        // start time check
      } else if (session.start_time) {
        if (current_time >= session.start_time) {
          return await this.createPresence({
            gateway,
            session,
            siswa,
            client,
            method: 'card'
          })
        } else {
          this.handlingPresenceError({
            error: `Presensi Mulai pada ${format(session.start_time, 'dd/MM/yyyy HH:mm:ss', {
              locale: id
            })}`,
            siswa
          })
        }
        // end time check
      } else if (session.end_time) {
        if (current_time <= session.end_time) {
          return await this.createPresence({
            gateway,
            session,
            siswa,
            client,
            method: 'card'

          })
        } else {
          this.handlingPresenceError({
            error: `Presensi Sudah Selesai pada ${format(session.end_time, 'dd/MM/yyyy HH:mm:ss', {
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
    } else {
      this.handlingPresenceError({
        error: "GATEWAY TDK DITEMUKAN",
        siswa
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
            // if (this.whatsappProvider.client) {

            //   await this.whatsappProvider.sendMessage({
            //     message: `*[Notification]*\n\n*Terimakasih Telah melakukan presensi dengan detail presensi sebagai berikut*  :\n\n*Nama* :  ${siswa.name}\n*Masuk (Check in)* :  ${format(new Date(updateExitTime.enter_time), 'dd/MM/yyyy HH:mm:ss', { locale: id })}\n*Keluar (Check out)* :  ${format(new Date(updateExitTime.exit_time), 'dd/MM/yyyy HH:mm:ss', { locale: id })}\n*Lokasi* :  ${gateway.location}\n*Sesi* :  ${session.name}\n*Metode* :  ${updateExitTime.method}`,
            //     phone: [+siswa.notelp]
            //   })
            // }

            return updateExitTime
          }

        } else {
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
          // if (this.whatsappProvider.client) {
          //   await this.whatsappProvider.sendMessage({
          //     message: `*[Notification]*\n\n*Terimakasih Telah melakukan presensi dengan detail presensi sebagai berikut*  :\n\n*Nama* :  ${siswa.name}\n*Masuk (Check in)* :  ${format(new Date(createPresenceEnter.enter_time), 'dd/MM/yyyy HH:mm:ss', { locale: id })}\n*Keluar (Check out)* :  ${createPresenceEnter.exit_time ? format(new Date(createPresenceEnter.exit_time), 'dd/MM/yyyy HH:mm:ss', { locale: id }) : '-'}\n*Lokasi* :  ${gateway.location}\n*Sesi* :  ${session.name}\n*Metode* :  ${createPresenceEnter.method}`,
          //     phone: [+siswa.notelp]
          //   })
          // }
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
          // if (this.whatsappProvider.client) {
          //   await this.whatsappProvider.sendMessage({
          //     message: `*[Notification]*\n\n*Terimakasih Telah melakukan presensi dengan detail presensi sebagai berikut*  :\n\n*Nama* :  ${siswa.name}\n*Masuk (Check in)* :  ${format(new Date(createPresence.enter_time), 'dd/MM/yyyy HH:mm:ss', { locale: id })}\n*Lokasi* :  ${gateway.location}\n*Sesi* :  ${session.name}\n*Metode* :  ${createPresence.method}`,
          //     phone: [+siswa.notelp]
          //   })
          // }
          return createPresence;
        }
      }
    })
  }


  protected handlingPresenceError({
    error,
    siswa
  }: { error: any, siswa: siswa }): Error {
    throw new Error(JSON.stringify({ error, siswa }))
  }


  async findAllPresenceToday({ sessionId }: {
    sessionId: string,
  }) {
    const session = await this.prismaService.client.presence_sessions.findUniqueOrThrow({
      where: {
        id: parseInt(sessionId)
      }
    })

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
      Nama: presence.siswa.name,
      NISN: presence.siswa.nisn,
      NIS: presence.siswa.nis,
      Rombel: presence.siswa.rombel,
      Masuk: presence.enter_time ? format(presence.enter_time, 'dd/MM/yyyy HH:mm:sss', {
        locale: id
      }) : '-',
      Keluar: presence.exit_time ? format(presence.exit_time, 'dd/MM/yyyy HH:mm:sss', {
        locale: id
      }) : '-',
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

  async findAllRombel(
    sessionId: string,
    search?: string,
    date?: string,
    rombel?: string

  ) {
    const rombels = await this.siswaService.getGroupClass();
    if (rombels.includes(rombel)) {
      if (!isValidDateString(date, 'yyyy-MM-dd')) {
        throw new BadRequestException("date invalid")
      }


      const session = await this.prismaService.client.presence_sessions.findUniqueOrThrow({
        where: {
          id: parseInt(sessionId)
        }
      })
      const presences = await this.prismaService.client.siswa.findMany({
        select: {
          id: true,
          name: true,
          rombel: true,
          createdAt: true,
          updatedAt: true,
          presences: {
            select: {
              gateway: true,
              presence_sessionsId: true,
              createdAt: true,
              enter_time: true,
              exit_time: true
            }
          },
        },
        where: {
          rombel: {
            equals: rombel
          },
          ...search && {
            OR: [
              {
                name: {
                  contains: search,
                  mode: 'insensitive'
                },
              },
            ],
          },
        }
      })

      const checkSiswaHasPresence = presences.map(presence => {
        return {
          ...presence,
          hasPresence: presence.presences.some(presence => presence.presence_sessionsId === session.id && format(presence.createdAt, 'yyyy-MM-dd') === date),
          detailPresence: presence.presences.find(presence => presence.presence_sessionsId === session.id && format(presence.createdAt, 'yyyy-MM-dd') === date),
        }
      })

      return checkSiswaHasPresence.map(presence => {
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
    } else {
      throw new NotFoundException()
    }

  }

  async exportByClass(
    sessionId: string,
    search?: string,
    date?: string,
    rombel?: string
  ) {
    const rombels = await this.siswaService.getGroupClass();
    if (rombels.includes(rombel)) {
      if (!isValidDateString(date, 'yyyy-MM-dd')) {
        throw new BadRequestException("date invalid")
      }


      const session = await this.prismaService.client.presence_sessions.findUniqueOrThrow({
        where: {
          id: parseInt(sessionId)
        }
      })
      const presences = await this.prismaService.client.siswa.findMany({
        select: {
          id: true,
          name: true,
          rombel: true,
          createdAt: true,
          updatedAt: true,
          presences: {
            select: {
              gateway: true,
              presence_sessionsId: true,
              createdAt: true,
              enter_time: true,
              exit_time: true
            }
          },
          nis: true,
          nisn: true,

        },
        where: {
          rombel: {
            equals: rombel
          },
          ...search && {
            OR: [
              {
                name: {
                  contains: search,
                  mode: 'insensitive'
                },
              },
            ],
          },
        }
      })

      const checkSiswaHasPresence = presences.map(presence => {
        return {
          ...presence,
          hasPresence: presence.presences.some(presence => presence.presence_sessionsId === session.id && format(presence.createdAt, 'yyyy-MM-dd') === date),
          detailPresence: presence.presences.find(presence => presence.presence_sessionsId === session.id && format(presence.createdAt, 'yyyy-MM-dd') === date),
        }
      })
      const mappingPresences = checkSiswaHasPresence.map(presence => ({
        Nama: presence.name,
        NISN: presence.nisn,
        NIS: presence.nis,
        Rombel: presence.rombel,
        Status: presence.hasPresence ? "Presensi" : "Tidak Presensi",
        Masuk: presence.hasPresence ? presence.detailPresence.enter_time ? format(presence.detailPresence.enter_time, 'dd/MM/yyyy HH:mm:sss', {
          locale: id
        }) : '-' : '-',
        Keluar: presence.hasPresence ? presence.detailPresence.exit_time ? format(presence.detailPresence.exit_time, 'dd/MM/yyyy HH:mm:sss', {
          locale: id
        }) : '-' : '-',
        Session: session.name,
        Gateway: presence.hasPresence ? `${presence.detailPresence.gateway.name}-${presence.detailPresence.gateway.location}` : '-',
      }))


      const worksheet = xlsx.utils.json_to_sheet(mappingPresences);
      const workbook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(workbook, worksheet, 'Presences');
      const buffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });
      return buffer;
    } else {
      throw new NotFoundException()
    }
  }
}
