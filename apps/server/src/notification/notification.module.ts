import { Global, Module } from "@nestjs/common";
import { WhatsappProvider } from "src/whatsapp/whatsapp.provider";
import { WhatsappService } from "src/whatsapp/whatsapp.service";
import { NotificationService } from "./notification.service";

@Global()
@Module({
    providers: [NotificationService, WhatsappService, WhatsappProvider],
    exports: [NotificationService]
})
export class NotificationModule {

}