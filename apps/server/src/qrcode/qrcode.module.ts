import { Global, Module } from "@nestjs/common";
import { QRCodeService } from "./qrcode.service";
@Global()
@Module({
    providers: [QRCodeService],
    exports: [QRCodeService]
})
export class QrCodeModule {

}