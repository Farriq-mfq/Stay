import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { gateways, presence_sessions, PresenceMethod, siswa } from '@prisma/client';
import { error } from 'console';
import { CustomPrismaService } from 'nestjs-prisma';
import { InjectBot } from 'nestjs-telegraf';
import { Server } from 'socket.io';
import { ScannedDto } from 'src/gateways/dto/scanned.dto';
import { Context } from 'src/interfaces/context.interface';
import { ExtendedPrismaClient } from 'src/prisma.extension';
import { AppChannel1 } from 'src/telegram/channel1/app-channel1.contants';
import { WhatsappProvider } from 'src/whatsapp/whatsapp.provider';
import { Telegraf } from 'telegraf';
import * as xlsx from 'xlsx';
@Injectable()
export class PresenceService {
  constructor(
    @Inject('PrismaService') private prismaService: CustomPrismaService<ExtendedPrismaClient>,
    @InjectBot(AppChannel1) private bot: Telegraf<Context>,
    private readonly whatsappProvider: WhatsappProvider
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
  //       Terimakasih Telah melakukan presensi dengan detail presensi sebagai berikut :\n\n<strong>Nama:</strong> ${siswa.name}\n<strong>Tanggal:</strong> ${format(new Date(presence.createdAt), 'EEEE, d MMMM yyyy', { locale: id })}\n<strong>Sesi:</strong> ${session.name}\n<strong>Metode:</strong> QRCode\n\nTerima kasih.
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

  async createPresenceByScanned(scanned: ScannedDto, gateway: gateways, client: Server): Promise<void> {
    const siswa = await this.prismaService.client.siswa.findUnique({
      where: {
        rfid_token: scanned.scan
      },
      include: {
        telegram_account: true
      }
    })

    if (!siswa) return;

    if (gateway.presence_sessionsId) {
      // presence
      const session = await this.prismaService.client.presence_sessions.findUnique({
        where: {
          id: gateway.presence_sessionsId,
        }
      })

      if (!session) {
        throw new BadRequestException("Session not found")
      }
      const current_time = new Date();
      // check session have start_time and end_time
      // range check
      if (session.start_time && session.end_time) {
        if (current_time.getTime() >= session.start_time.getTime() && current_time.getTime() <= session.end_time.getTime()) {
          await this.createPresence({
            gateway,
            session,
            siswa,
            client,
            method: 'card'
          })
        } else {
          this.handlingPresenceError({
            error: `Presensi Mulai pada ${session.start_time} dan Selesai pada ${session.end_time}`,
            siswa
          })
        }
        // start time check
      } else if (session.start_time) {
        if (current_time >= session.start_time) {
          await this.createPresence({
            gateway,
            session,
            siswa,
            client,
            method: 'card'
          })
        } else {
          this.handlingPresenceError({
            error: `Presensi Mulai pada ${session.start_time}`,
            siswa
          })
        }
        // end time check
      } else if (session.end_time) {
        if (current_time <= session.end_time) {
          await this.createPresence({
            gateway,
            session,
            siswa,
            client,
            method: 'card'

          })
        } else {
          this.handlingPresenceError({
            error: `Presensi Sudah Selesai pada ${session.end_time}`,
            siswa
          })
        }

      } else {
        // ignore some session start and end times
        await this.createPresence({
          gateway,
          session,
          siswa,
          client,
          method: 'card'
        })
      }
    } else {
      this.handlingPresenceError({
        error: "Gateway tidak ditemukan",
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
    gateway: gateways,
    client: Server,
    session: presence_sessions,
    method: PresenceMethod
  }) {
    if (session.allow_twice) {
      const checkPresence = await this.prismaService.client.presences.findFirst({
        where: {
          siswaId: siswa.id,
          presence_sessionsId: session.id,
          enter_time: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          },
          method
        }
      })

      if (checkPresence) {
        const checkPresenceHaveExitTime = await this.prismaService.client.presences.findFirst({
          where: {
            siswaId: siswa.id,
            presence_sessionsId: session.id,
            enter_time: {
              gte: new Date(new Date().setHours(0, 0, 0, 0))
            },
            exit_time: {
              gte: new Date(new Date().setHours(0, 0, 0, 0))
            },
            method
          }
        })
        if (checkPresenceHaveExitTime) {
          this.handlingPresenceError({
            error: `Anda sudah melakukan semua presensi`,
            siswa
          })
        } else {
          // update the exit_time
          const updateExitTime = await this.prismaService.client.presences.update({
            where: {
              id: checkPresence.id,
            },
            data: {
              exit_time: new Date()
            }
          })
          await this.whatsappProvider.sendMessage({
            message: `*[Notification]*\n\n${JSON.stringify(updateExitTime)}`,
            phone: [+siswa.notelp]
          })
        }

      } else {
        const createPresenceEnter = await this.prismaService.client.presences.create({
          data: {
            presence_sessionsId: session.id,
            siswaId: siswa.id,
            gatewaysId: gateway.id,
            enter_time: new Date(),
            method,
          }
        })
        await this.whatsappProvider.sendMessage({
          message: `*[Notification]*\n\n${JSON.stringify(createPresenceEnter)}`,
          phone: [+siswa.notelp]
        })
      }
    } else {
      const checkPresence = await this.prismaService.client.presences.findFirst({
        where: {
          siswaId: siswa.id,
          presence_sessionsId: session.id,
          gatewaysId: gateway.id,
          enter_time: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          },
          method
        }
      })

      if (checkPresence) {
        this.handlingPresenceError({
          error: `Anda sudah melakukan semua presensi`,
          siswa
        })
      } else {
        const createPresence = await this.prismaService.client.presences.create({
          data: {
            presence_sessionsId: session.id,
            siswaId: siswa.id,
            gatewaysId: gateway.id,
            enter_time: new Date(),
            method,
          }
        })
        await this.whatsappProvider.sendMessage({
          message: `*[Notification]*\n\n${JSON.stringify(createPresence)}`,
          phone: [+siswa.notelp]
        })
      }
    }
  }


  protected handlingPresenceError({
    error,
    siswa
  }: { error: any, siswa: siswa }): Error {
    throw new Error(JSON.stringify({ error, siswa }))
  }

  async findAll(
    sessionId: string,
    page?: number,
    limit?: number,
    search?: string,
  ) {
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
  ) {
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
      Session: presence.session.name,
      Location: presence.gateway ? presence.gateway.location : '-',
      Metode: presence.method,
      Tanggal: presence.createdAt
    }))


    const worksheet = xlsx.utils.json_to_sheet(mappingPresences);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Presences');
    const buffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    return buffer;
  }
}
