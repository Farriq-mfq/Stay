import { Injectable, Logger } from "@nestjs/common";
import { InjectBot } from "nestjs-telegraf";
import { Context } from "src/interfaces/context.interface";
import { AppChannel1 } from "src/telegram/channel1/app-channel1.contants";
import { SendMessageDto } from "src/whatsapp/dto/send-message.dto";
import { WhatsappService } from "src/whatsapp/whatsapp.service";
import { Telegraf } from "telegraf";

@Injectable()
export class NotificationService {
    private readonly logger = new Logger(WhatsappService.name);

    constructor(
        @InjectBot(AppChannel1) private bot: Telegraf<Context>,
        private readonly whatsappService: WhatsappService,
    ) {

    }


    async notificationTelegram(
        chat_id: string,
        message: string
    ): Promise<void> {
        try {
            await this.bot.telegram.sendMessage(chat_id, message, {
                parse_mode: 'HTML'
            });
        } catch {
            this.logger.error('Error sending notification via telegram')
        }
    }
    async notificationWhatsapp(
        sendMessageDto: SendMessageDto
    ): Promise<void> {
        await this.whatsappService.sendMessage(sendMessageDto);

    }
    // notificationBySiswa() { }
}