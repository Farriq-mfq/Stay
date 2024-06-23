import { Inject, InternalServerErrorException, Logger, UseFilters } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import { Ctx, Message, On, Sender, Wizard, WizardStep } from 'nestjs-telegraf';
import { BypassInterceptor } from 'src/decorators/bypass-interceptor';
import { TelegrafExceptionFilter } from 'src/filters/telegraf-exception.filter';
import { ExtendedPrismaClient } from 'src/prisma.extension';
import { Markup } from 'telegraf';
import { WizardContext } from 'telegraf/typings/scenes';
import { REGISTER_SISWA } from '../app-channel1.contants';

@Wizard(REGISTER_SISWA)
@BypassInterceptor()
@UseFilters(TelegrafExceptionFilter)
export class RegisterSiswaWizard {
    constructor(
        @Inject('PrismaService') private prismaService: CustomPrismaService<ExtendedPrismaClient>,

    ) {

    }

    @WizardStep(1)
    async onSceneEnter(@Ctx() ctx: WizardContext): Promise<string> {
        await ctx.wizard.next();
        return "Tuliskan NISN ❓:";
    }

    @On('text')
    @WizardStep(2)
    async onNisn(
        @Ctx() ctx: WizardContext,
        @Message() msg: { text: string },
        @Sender('first_name') first_name: string,
        @Sender('last_name') last_name: string,
        @Sender('id') id: string,
        @Sender('username') username: string
    ): Promise<string> {
        try {
            const nisn = msg.text;
            // loading
            await ctx.sendMessage("Sedang mencari data anda...");
            const siswa = await this.prismaService.client.siswa.findUnique({
                where: {
                    nisn: nisn
                },
                include: {
                    telegram_account: true
                }
            })

            if (siswa) {
                console.log(siswa)
                const telegram = await this.prismaService.client.telegram_account.findUnique({
                    where: {
                        siswaId: siswa.id,
                        chat_id: id.toString()
                    }
                })
                if (telegram) {
                    return 'Akun anda sudah diregistrasi ✅'
                } else {
                    // create telegram account
                    await this.prismaService.client.telegram_account.create({
                        data: {
                            siswaId: siswa.id,
                            username,
                            name: `${first_name} ${last_name}`,
                            chat_id: id.toString()
                        }
                    })
                    await ctx.scene.leave();
                    return `Berhasil registrasi ✅ ${nisn}`;
                }

            } else {
                await ctx.scene.leave();
                await ctx.reply('Nisn anda belum terdaftar ❌', Markup.inlineKeyboard([
                    Markup.button.callback('Ulangi', 'register'),
                    Markup.button.callback('Hubungi admin', 'contact_admin'),
                ], { columns: 2 }))

                return '';
            }
        } catch (e) {
            Logger.error(e)
            await ctx.scene.leave();
            throw new InternalServerErrorException('Tejadi kesalahan')
        }
    }
}
