import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res } from "@nestjs/common";
import { Response } from "express";
import { SendMessageDto } from "./dto/send-message.dto";
import { WhatsappProvider } from "./whatsapp.provider";
import { HandlerMessageDto } from "./dto/handler-message.dto";

@Controller('/whatsapp')
export class WhatsappController {

    constructor(
        private readonly whatsappProvider: WhatsappProvider
    ) { }

    @Get('/qr-code')
    qrClientConnect(@Res() res: Response) {
        const path = this.whatsappProvider.getQr();
        res.sendFile(path);
    }


    @Post('/send-message')
    sendMessage(@Body() SendMessageDto: SendMessageDto): any {
        const response = this.whatsappProvider.sendMessage(SendMessageDto);
        return response;
    }
    @Get('/status')
    async getClientStatusConnected() {
        return await this.whatsappProvider.getStatusConnected();
    }

    @Post('/update-connection')
    @HttpCode(HttpStatus.OK)
    async updateSateConnection() {
        return await this.whatsappProvider.forceUpdateConnectionState()
    }

    @Get('/get-connection-state')
    async getStateConnection() {
        return await this.whatsappProvider.getConnectionState()
    }

    @Post('/conversetion')
    async handleMessage(
        @Body() body: HandlerMessageDto
    ) {
        return this.whatsappProvider.handlerMessage(body)
    }
}