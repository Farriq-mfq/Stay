import { Global, Module } from "@nestjs/common";
import { WhatsappController } from "./whatsapp.controller";
import { WhatsappService } from "./whatsapp.service";
import { WhatsappProvider } from "./whatsapp.provider";

@Global()
@Module({
    controllers: [WhatsappController],
    providers: [WhatsappService, WhatsappProvider],
    exports: [WhatsappService, WhatsappProvider]
})
export class WhatsappModule {

}