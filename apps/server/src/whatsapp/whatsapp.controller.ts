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
        if (this.whatsappProvider.getClient()) return res.status(404).json({
            message: 'QRcode Is Not Found'
        });
        const path = this.whatsappProvider.getQr();
        res.sendFile(path);
    }

    @Post('/logout')
    @HttpCode(HttpStatus.OK)
    async logout() {
        return await this.whatsappProvider.logout()
    }

    @Post('/send-message')
    sendMessage(@Body() SendMessageDto: SendMessageDto): any {
        return this.whatsappProvider.sendMessage(SendMessageDto);
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