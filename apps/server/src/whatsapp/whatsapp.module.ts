import { Global, Module } from "@nestjs/common";
import { WhatsappController } from "./whatsapp.controller";
import { WhatsappProvider } from "./whatsapp.provider";
@Global()
@Module({
    controllers: [WhatsappController],
    providers: [WhatsappProvider],
    exports: [WhatsappProvider]
})
export class WhatsappModule {

}