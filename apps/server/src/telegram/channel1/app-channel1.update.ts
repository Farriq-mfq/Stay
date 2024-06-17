import { Inject, InternalServerErrorException, Logger, UseFilters } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import { Action, Command, Ctx, Hears, Sender, Start, Update } from 'nestjs-telegraf';
import * as qr from 'qrcode';
import { BypassInterceptor } from 'src/decorators/bypass-interceptor';
import { TelegrafExceptionFilter } from 'src/filters/telegraf-exception.filter';
import { Context } from 'src/interfaces/context.interface';
import { ExtendedPrismaClient } from 'src/prisma.extension';
import { Markup } from 'telegraf';
import { REGISTER_SISWA } from './app-channel1.contants';
import * as fs from 'fs';
import * as path from 'path';

@Update()
@BypassInterceptor()
export class AppChannel1Update {
    constructor(
        @Inject('PrismaService') private prismaService: CustomPrismaService<ExtendedPrismaClient>,

    ) { }


    @Start()
    async onStart(
        @Ctx() ctx: Context
    ): Promise<string> {
        const menuMarkup = Markup.inlineKeyboard([
            Markup.button.callback('Register', 'register'),
            Markup.button.callback('QRCode', 'qrcode'),
            Markup.button.callback('Contact admin', 'contact_admin'),
            Markup.button.callback('Author', 'author'),
        ], { columns: 2 });

        await ctx.reply('Silahkan Pilih Menu dibawah ini 👇', menuMarkup)
        return '';
    }

    @Hears(['menu', 'Menu'])
    onMenu(
        @Ctx() ctx: Context
    ) {
        this.onStart(ctx)
    }

    @Command('register')
    @Action('register')
    async onRegisterSiswa(@Ctx() ctx: Context): Promise<void> {
        await ctx.scene.enter(REGISTER_SISWA)
    }

    @Command('qrcode')
    @Action('qrcode')
    @UseFilters(TelegrafExceptionFilter)
    async onGetQrCode(@Ctx() ctx: Context,
        @Sender('id') id: number
    ): Promise<void> {
        try {
            // check the siswa account
            const telegram = await this.prismaService.client.telegram_account.findUnique({
                where: {
                    chat_id: id.toString()
                },
                include: {
                    siswa: true
                }
            })

            if (telegram && telegram.siswa) {
                const qrCodeFilePath = await this.generateQRCode(telegram.siswa.nisn)
                await ctx.replyWithPhoto({ source: fs.createReadStream(qrCodeFilePath) }, { caption: `QRCODE ✅ ${telegram.siswa.name}` })
                fs.unlink(qrCodeFilePath, (err) => {
                    if (err) {
                        throw new InternalServerErrorException('Terjadi kesalahan')
                    }
                });
            } else {
                await ctx.reply('Akun anda belum diregistrasi ❌', Markup.inlineKeyboard([
                    Markup.button.callback('Register', 'register'),
                    Markup.button.callback('Hubungi admin', 'contact_admin'),
                ], { columns: 2 }))
            }
        } catch (err) {
            Logger.error(err)
            throw new InternalServerErrorException('Terjadi kesalahan')
        }

    }
    @Action('contact_admin')
    async onContactAdmin(@Ctx() ctx: Context): Promise<void> {
        await ctx.reply('You are admin');
    }
    @Action('author')
    async onGetAuthor(@Ctx() ctx: Context): Promise<void> {
        await ctx.reply('Farriq Muwaffaq');
    }

    protected async generateQRCode(text: string): Promise<string> {
        try {
            const dumpDir = path.join(__dirname, 'dumps');
            if (!fs.existsSync(dumpDir)) {
                fs.mkdirSync(dumpDir, { recursive: true });
            }
            const qrCodeFilePath = path.join(__dirname, 'dumps', `${text}.png`);
            await qr.toFile(qrCodeFilePath, text, {
                width: 500,
                margin: 2,
            });
            return qrCodeFilePath;
        } catch (error) {
            throw error;
        }
    }
}