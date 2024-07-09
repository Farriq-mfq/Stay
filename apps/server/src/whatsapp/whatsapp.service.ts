import { BadRequestException, Injectable } from "@nestjs/common";
import { WhatsappProvider } from "./whatsapp.provider";
import { existsSync } from "fs";
import * as path from "path";
import { SendMessageDto } from "./dto/send-message.dto";

@Injectable()
export class WhatsappService {
    constructor(private readonly whatsappProvider: WhatsappProvider) { }

    getQr() {
        const qrCodePath = path.join(__dirname, './temp/qr.png');
        if (!existsSync(qrCodePath))
            throw new BadRequestException(`No qr found`);

        return qrCodePath;
    }

    async sendMessage(sendMessageDto: SendMessageDto) {
        return await this.whatsappProvider.sendMessage(sendMessageDto);
        // const respuesta: RespuestaDto = {
        //     success: responseExSave.id ? true : false,
        //     message: 'SOLICITUD PROCESADA',
        //     content: responseExSave,
        // };
        // return respuesta;
    }
}