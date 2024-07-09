import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { gateways } from '@prisma/client';
import { format } from 'date-fns';
import { id } from 'date-fns/locale'
import { CustomPrismaService } from 'nestjs-prisma';
import { InjectBot } from 'nestjs-telegraf';
import { Server } from 'socket.io';
import { ScannedDto } from 'src/gateways/dto/scanned.dto';
import { Context } from 'src/interfaces/context.interface';
import { ExtendedPrismaClient } from 'src/prisma.extension';
import { AppChannel1 } from 'src/telegram/channel1/app-channel1.contants';
import { Telegraf } from 'telegraf';
import { CreatePresenceByQRDTO } from './dto/create-presence.dto';
import * as xlsx from 'xlsx';
import { NotificationService } from 'src/notification/notification.service';
@Injectable()
export class PresenceService {
  constructor(
    @Inject('PrismaService') private prismaService: CustomPrismaService<ExtendedPrismaClient>,
    // @InjectBot(AppChannel1) private bot: Telegraf<Context>
    private readonly notificationService: NotificationService
  ) { }
  async createPresenceByQR(CreatePresenceByQRDTO: CreatePresenceByQRDTO) {
    // check the session
    const session = await this.prismaService.client.presence_sessions.findUniqueOrThrow({
      where: {
        id: CreatePresenceByQRDTO.session
      }
    })

    // check the nisn
    const siswa = await this.prismaService.client.siswa.findUniqueOrThrow({
      where: {
        nisn: CreatePresenceByQRDTO.nisn
      },
      include: {
        telegram_account: true
      }
    })
    if (session && siswa) {
      // check today already exists
      const checkPresenceAlready = await this.prismaService.client.presences.findFirst({
        where: {
          siswaId: siswa.id,
          presence_sessionsId: session.id,
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      })

      if (checkPresenceAlready) {
        throw new BadRequestException()
      }
      // create the presence
      const presence = await this.prismaService.client.presences.create({
        data: {
          siswaId: siswa.id,
          presence_sessionsId: session.id,
          method: 'qrcode'
        }
      })
      if (siswa.telegram_account) {
        const htmlContent = `
        Terimakasih Telah melakukan presensi dengan detail presensi sebagai berikut :\n\n<strong>Nama:</strong> ${siswa.name}\n<strong>Tanggal:</strong> ${format(new Date(presence.createdAt), 'EEEE, d MMMM yyyy', { locale: id })}\n<strong>Sesi:</strong> ${session.name}\n<strong>Metode:</strong> QRCode\n\nTerima kasih.
        `;
        await this.notificationService.notificationTelegram(siswa.telegram_account.chat_id, htmlContent)
      }

      return presence
    } else {
      throw new BadRequestException()
    }
  }

  async createPresenceByScanned(scanned: ScannedDto, gateway: gateways, client: Server) {
    const siswa = await this.prismaService.client.siswa.findUnique({
      where: {
        rfid_token: scanned.scan
      },
      include: {
        telegram_account: true
      }
    })
    if (gateway.presence_sessionsId === null) {
      if (siswa.telegram_account) {
        return await this.notificationService.notificationTelegram(siswa.telegram_account.chat_id, `<b>Maaf Perangkat ini masih belum bisa dibuka atau digunakan</b>`)
      }
    } else {
      // presence
      const session = await this.prismaService.client.presence_sessions.findUnique({
        where: {
          id: gateway.presence_sessionsId
        }
      })
      const checkPresenceAlready = await this.prismaService.client.presences.findFirst({
        where: {
          siswaId: siswa.id,
          presence_sessionsId: session.id,
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        },
        include: {
          siswa: true,
        }
      })

      if (checkPresenceAlready) {
        if (siswa.telegram_account) {
          await this.notificationService.notificationTelegram(siswa.telegram_account.chat_id, `<strong>Anda sudah melakukan presensi dengan detail presensi sebagai berikut</strong>  :\n\n<strong>Nama : </strong> ${checkPresenceAlready.siswa.name}\n<strong>Tanggal : </strong> ${format(new Date(checkPresenceAlready.createdAt), 'EEEE, d MMMM yyyy', { locale: id })}\n<strong>Lokasi : </strong> ${gateway.location}\n<strong>Sesi : </strong> ${session.name}\n<strong>Metode : </strong> ${checkPresenceAlready.method}`)
        }
        // whatsapp notification
        if (siswa.notelp) {
          await this.notificationService.notificationWhatsapp({
            phone: +siswa.notelp,
            message: "Maaf anda sudah melakukan presensi hari ini terimakasih :)"
          })
        }
        return;
      }

      const presence = await this.prismaService.client.presences.create({
        data: {
          siswaId: siswa.id,
          presence_sessionsId: gateway.presence_sessionsId,
          gatewaysId: gateway.id,
          method: 'card'
        }
      })
      if (presence) {
        // notify socket io
        client.emit(`PRESENCE_UPDATED_${session.id}`, true)
        if (siswa.telegram_account) {
          const htmlContent = `<strong>Terimakasih Telah melakukan presensi dengan detail presensi sebagai berikut</strong>  :\n\n<strong>Nama : </strong> ${siswa.name}\n<strong>Tanggal : </strong> ${format(new Date(presence.createdAt), 'EEEE, d MMMM yyyy', { locale: id })}\n<strong>Lokasi : </strong> ${gateway.location}\n<strong>Sesi : </strong> ${session.name}\n<strong>Metode : </strong> ${presence.method}
          `;
          await this.notificationService.notificationTelegram(siswa.telegram_account.chat_id, htmlContent)
        }

        // whatsapp notification
        if (siswa.notelp) {
          await this.notificationService.notificationWhatsapp({
            phone: +siswa.notelp,
            message: `*Terimakasih Telah melakukan presensi dengan detail presensi sebagai berikut*  :\n\n*Nama* :  ${siswa.name}\n*Tanggal* :  ${format(new Date(presence.createdAt), 'EEEE, d MMMM yyyy', { locale: id })}\n*Lokasi* :  ${gateway.location}\n*Sesi* :  ${session.name}\n*Metode* :  ${presence.method}
          `
          })
        }
      } else {
        if (siswa.telegram_account) {
          await this.notificationService.notificationTelegram(siswa.telegram_account.chat_id, `Perangkat masih dalam kendala`)
        }
      }
    }
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
        method: true
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
        method: true
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
