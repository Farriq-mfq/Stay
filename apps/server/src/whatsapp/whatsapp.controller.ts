import { Body, Controller, Get, Post, Res } from "@nestjs/common";
import { Response } from "express";
import { WhatsappService } from "./whatsapp.service";
import { SendMessageDto } from "./dto/send-message.dto";

@Controller('/whatsapp')
export class WhatsappController {

    constructor(
        private readonly whatsappService: WhatsappService
    ) { }

    @Get('/qr-code')
    qrClientConnect() {
        const path = this.whatsappService.getQr();
        return path
    }


    @Post('/send-message')
    sendMessage(@Body() SendMessageDto: SendMessageDto): any {
        const response = this.whatsappService.sendMessage(SendMessageDto);
        return response;
    }
}