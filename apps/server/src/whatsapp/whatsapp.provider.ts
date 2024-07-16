import { BadRequestException, Inject, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import * as wa from '@open-wa/wa-automate';
import { format } from "date-fns";
import { id } from "date-fns/locale";
import * as fs from 'fs';
import { CustomPrismaService } from "nestjs-prisma";
import * as path from "path";
import * as qr from 'qrcode';
import { config } from "src/config";
import { ExtendedPrismaClient } from "src/prisma.extension";
import { HandlerMessageDto } from "./dto/handler-message.dto";
import { SendMessageDto } from "./dto/send-message.dto";

@Injectable()
export class WhatsappProvider {
    private readonly logger = new Logger(WhatsappProvider.name);
    private client?: wa.Client
    constructor(
        @Inject('PrismaService') private prismaService: CustomPrismaService<ExtendedPrismaClient>,
    ) {
        if (config.whatsapp_bot) {
            this.start()
        }
    }

    async start() {
        try {
            this.initialize()
            wa.ev.on("qr.**", async (qrcode) => {
                this.saveQRCodeToFile(qrcode)
            });
        } catch {
            this.logger.error("Error whatsapp connection")
        }
    }
    async initialize() {
        this.client = await wa.create({
            sessionId: "NOTIFICATION_HELPER",
            qrTimeout: 0,
            authTimeout: 0,
            autoRefresh: true,
            qrRefreshS: 15,
            headless: true,
            killProcessOnBrowserClose: true,
            useChrome: true,
        })


        if (this.client) {
            this.client.onStateChanged((state) => {
                this.logger.log(`State changed: ${state}`);
                if (state === "CONFLICT" || state === "UNLAUNCHED") this.client.forceRefocus();
                // check is authenticated
                // if (state === wa.Events.AUTHENTICATED.toString()) {
                //     // this.eventGateway.emitWhatsapp(true)
                //     // this.server.emit('WHATSAPP_EVENT', true)
                // }
            });


            this.client.onAnyMessage((message) => {
                console.log(message.from)
                this.logger.log(`Received message: ${message.body}`);
                this.handlerMessage({
                    phone: message.from,
                    message: message.body
                })
            });

        } else {
            this.logger.error('WhatsApp client not initialized');
        }

    }

    async sendMessage(sendMessageDto: SendMessageDto): Promise<boolean | wa.MessageId> {
        if (!this.client) throw new BadRequestException("Client not ready")
        return await this.client.sendText(`${sendMessageDto.phone}@c.us`, sendMessageDto.message);
    }

    saveQRCodeToFile(qrCode) {
        const qrCodeDir = path.join(__dirname, './temp');
        if (!fs.existsSync(qrCodeDir)) {
            fs.mkdirSync(qrCodeDir);
        }

        const qrCodeFilePath = path.join(__dirname, './temp/qr.png')

        const base64Data = qrCode.replace(/^data:image\/png;base64,/, "");

        fs.writeFileSync(qrCodeFilePath, base64Data, 'base64');
    }

    async logout() {
        if (!this.client) throw new BadRequestException("Client not ready")
        await this.client.logout(true)
    }


    async getStatusConnected(): Promise<boolean> {
        if (!this.client) throw new BadRequestException("Client not ready")
        return await this.client.isConnected();
    }

    async getConnectionState(): Promise<wa.STATE> {
        if (!this.client) throw new BadRequestException("Client not ready")
        return await this.client.getConnectionState()
    }

    async forceUpdateConnectionState(): Promise<void> {
        await this.client.forceUpdateConnectionState()
    }

    async getClient() {
        if (!this.client) throw new BadRequestException("Client not ready")
        return this.client
    }

    getQr() {
        const qrCodePath = path.join(__dirname, './temp/qr.png');
        if (!fs.existsSync(qrCodePath))
            throw new BadRequestException(`No qr found`);

        return qrCodePath;
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
                color: {
                    dark: "#010599FF",
                    light: "#FFBF60FF"
                }
            });
            return qrCodeFilePath;
        } catch (error) {
            throw error;
        }
    }

    async handlerMessage(
        payload: HandlerMessageDto
    ) {
        const message = payload.message.toLowerCase();
        const phone = payload.phone.toString();
        const phoneNumber = await phone.split('@')[0]

        const siswa = await this.prismaService.client.siswa.findUnique({
            where: {
                notelp: phoneNumber,
            }
        })

        switch (message) {
            case '/help':
                await this.client.sendText(
                    phone as wa.ChatId,
                    "Available commands:\n/help - Show this help\n/qrcode - Ger QRCode"
                )
                break;
            case '/qrcode':
                const qrCodeFilePath = await this.generateQRCode(siswa.nisn)
                await this.client.sendImage(phone as wa.ChatId, qrCodeFilePath, siswa.name, siswa.name)
                fs.unlink(qrCodeFilePath, (err) => {
                    if (err) {
                        throw new InternalServerErrorException('Terjadi kesalahan')
                    }
                });
                break;

            case '/presensi':
                const presences = await this.prismaService.client.presences.findMany({
                    where: {
                        siswaId: siswa.id,
                    },

                    include: {
                        gateway: true,
                        session: true
                    }

                })

                let allPresenceMessage = ``;

                presences.forEach(presence => {
                    allPresenceMessage += `\n*Terimakasih Telah melakukan presensi dengan detail presensi sebagai berikut*  :\n\n*Nama* :  ${siswa.name}\n*Tanggal* :  ${format(new Date(presence.createdAt), 'EEEE, d MMMM yyyy', { locale: id })}\n*Lokasi* :  ${presence.gateway.location}\n*Sesi* :  ${presence.session.name}\n*Metode* :  ${presence.method}\n`
                })

                this.client.sendText(
                    phone as wa.ChatId,
                    allPresenceMessage
                )

                break;
            default:
                this.client.sendText(
                    phone as wa.ChatId,
                    "Unknown command. Type /help for available commands"
                )
        }

        return {
            message,
            phone
        }
    }
}
