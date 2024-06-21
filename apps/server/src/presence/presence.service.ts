import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import { InjectBot } from 'nestjs-telegraf';
import { ScannedDto } from 'src/gateways/dto/scanned.dto';
import { Context } from 'src/interfaces/context.interface';
import { ExtendedPrismaClient } from 'src/prisma.extension';
import { AppChannel1 } from 'src/telegram/channel1/app-channel1.contants';
import { Telegraf } from 'telegraf';
import { CreatePresenceByQRDTO } from './dto/create-presence.dto';
import { gateways } from '@prisma/client';
import { Server } from 'socket.io';

@Injectable()
export class PresenceService {
  constructor(
    @Inject('PrismaService') private prismaService: CustomPrismaService<ExtendedPrismaClient>,
    @InjectBot(AppChannel1) private bot: Telegraf<Context>
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
          presence_sessionsId: session.id
        }
      })
      const htmlContent = `
      Terimakasih Telah melakukan presensi dengan detail presensi sebagai berikut :.\n
      <strong>Nama:</strong> ${siswa.name}\n
      <strong>Tanggal:</strong> ${presence.createdAt}\n
      <strong>Sesi:</strong> ${session.name}\n
      <strong>Metode:</strong> QRCode\n
      Terima kasih.
      `;
      await this.bot.telegram.sendMessage(siswa.telegram_account[0].chat_id, htmlContent, {
        parse_mode: 'HTML'
      })

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
        return await this.bot.telegram.sendMessage(siswa.telegram_account[0].chat_id, `<b>Maaf Perangkat ini masih belum bisa dibuka atau digunakan</b>`, {
          parse_mode: 'HTML'
        })
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
        }
      })

      if (checkPresenceAlready) {
        await this.bot.telegram.sendMessage(siswa.telegram_account[0].chat_id, `Anda sudah melakukan presensi hari ini dengan`, {
          parse_mode: 'HTML'
        })
        return;
      }

      const presence = await this.prismaService.client.presences.create({
        data: {
          siswaId: siswa.id,
          presence_sessionsId: gateway.presence_sessionsId,
          gatewaysId: gateway.id
        }
      })
      if (presence) {
        // notify socket io
        client.emit(`SESSION_${session.id}`, JSON.stringify(presence))
        const htmlContent = `
        Terimakasih Telah melakukan presensi dengan detail presensi sebagai berikut :.\n
        <strong>Nama : </strong> ${siswa.name}\n
        <strong>Tanggal : </strong> ${presence.createdAt}\n
        <strong>Lokasi : </strong> ${gateway.location}\n
        <strong>Sesi : </strong> ${session.name}\n
        <strong>Metode : </strong> Di Scan\n
        Terima kasih.
        `;
        await this.bot.telegram.sendMessage(siswa.telegram_account[0].chat_id, htmlContent, {
          parse_mode: 'HTML'
        })
      } else {
        await this.bot.telegram.sendMessage(siswa.telegram_account[0].chat_id, `Perangkat masih dalam kendala`, {
          parse_mode: 'HTML'
        })
      }
    }
  }
}
