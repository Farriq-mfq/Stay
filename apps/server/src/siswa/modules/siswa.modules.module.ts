import { Module } from "@nestjs/common";
import { TransactionModule } from "src/transaction/transaction.module";
import { SiswaAccountModuleController } from "./controllers/account.modules.controller";
import { HomeModulesSiswaController } from "./controllers/home.modules.controller";
import { SiswaModulesPresenceController } from "./controllers/presence.modules.controller";
import { QrCodeSiswaModulesController } from "./controllers/qrcode.modules.controller";
import { TransactionSiswaModuleController } from "./controllers/transaction.modules.controller";
import { SiswaAccountModuleService } from "./services/account.modules.service";
import { HomeModulesSiswaService } from "./services/home.modules.service";
import { SiswaModulesPresenceService } from "./services/presence.modules.service";
import { TransactionSiswaModuleService } from "./services/transactions.modules.service";
import { QrCodeModule } from "src/qrcode/qrcode.module";
import { QRCodeService } from "src/qrcode/qrcode.service";
import { QrCodeSiswaModulesService } from "./services/qrcode.modules.service";
import { EventsModule } from "src/events/events.module";

@Module({
    imports: [TransactionModule, QrCodeModule, EventsModule],
    controllers: [SiswaAccountModuleController, SiswaModulesPresenceController, TransactionSiswaModuleController, HomeModulesSiswaController, QrCodeSiswaModulesController],
    providers: [SiswaAccountModuleService, SiswaModulesPresenceService, TransactionSiswaModuleService, HomeModulesSiswaService, QRCodeService, QrCodeSiswaModulesService],
})
export class SiswaModulesModule {

}