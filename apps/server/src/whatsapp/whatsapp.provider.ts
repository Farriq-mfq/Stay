import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import * as wa from '@open-wa/wa-automate';
import * as fs from 'fs';
import * as path from "path";
import { SendMessageDto } from "./dto/send-message.dto";
import { WhatsappService } from "./whatsapp.service";
import * as qr from 'qr-image';
@Injectable()
export class WhatsappProvider {
    private readonly logger = new Logger(WhatsappService.name);
    private client: wa.Client
    constructor() {
        this.initialize()
    }
    async initialize() {
        this.client = await wa.create({
            sessionId: "NOTIFICATION_HELPER",
            qrTimeout: 0, // 0 means it will wait until a QR is scanned
            authTimeout: 0, // 0 means it will wait until a QR is scanned
            autoRefresh: true,
            qrRefreshS: 15,
            killProcessOnBrowserClose: true,
            headless: true,
            useChrome: true,
            qrCodeData: (qrCode) => {
                this.saveQRCodeToFile(qrCode);
            },
        })

        if (this.client) {
            this.client.onStateChanged((state) => {
                this.logger.log(`State changed: ${state}`);
                if (state === 'CONFLICT' || state === 'UNPAIRED') this.client.forceRefocus();
            });

            this.client.onAnyMessage((message) => {
                this.logger.log(`Received message: ${message.body}`);
            });
        } else {
            this.logger.error('WhatsApp client not initialized');
        }
    }

    async sendMessage(sendMessageDto: SendMessageDto): Promise<any> {
        if (!this.client) throw new BadRequestException("Client not ready")
        await this.client.sendText(`${sendMessageDto.phone}@c.us`, sendMessageDto.message);
    }

    saveQRCodeToFile(qrCode) {
        const qrCodeDir = path.join(__dirname, './temp');
        if (!fs.existsSync(qrCodeDir)) {
            fs.mkdirSync(qrCodeDir);
        }

        const qrCodeFilePath = path.join(__dirname, './temp/qr.png')
        const qrSvg = qr.image(qrCode, { type: 'png' });

        qrSvg.pipe(fs.createWriteStream(qrCodeFilePath));
    }
}
