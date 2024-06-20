import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from 'src/prisma.extension';
import { CreatePresenceByQRDTO } from './dto/create-presence.dto';
import { InjectBot } from 'nestjs-telegraf';
import { AppChannel1 } from 'src/telegram/channel1/app-channel1.contants';
import { Context } from 'src/interfaces/context.interface';
import { Telegraf } from 'telegraf';

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

  findAll() {
    return `This action returns all presence`;
  }

  findOne(id: number) {
    return `This action returns a #${id} presence`;
  }

  remove(id: number) {
    return `This action removes a #${id} presence`;
  }
}
