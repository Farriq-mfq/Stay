import { Module } from "@nestjs/common";
import { WhatsappController } from "./whatsapp.controller";
import { WhatsappService } from "./whatsapp.service";
import { TokenService } from "src/services/token.service";
@Module({
    controllers: [WhatsappController],
    providers: [WhatsappService, TokenService],
})
export class WhatsappModule {

}