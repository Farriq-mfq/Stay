import { Module } from "@nestjs/common";
import { PegawaiModulesPresenceController } from "./controllers/presence.modules.controller";
import { PegawaiModulesPresenceService } from "./services/presence.modules.service";
import { PegawaiAccountModuleService } from "./services/account.modules.service";
import { PegawaiAccountModuleServiceController } from "./controllers/account.modules.controller";
import { TransactionModule } from "src/transaction/transaction.module";
import { TransactionService } from "src/transaction/transaction.service";
import { TransactionPegawaiModuleController } from "./controllers/transaction.modules.controller";
import { TransactionPegawaiModuleService } from "./services/transactions.modules.service";
import { HomeModulesPegawaiService } from "./services/home.modules.service";
import { HomeModulesPegawaiController } from "./controllers/home.modules.controller";
import { QrCodePegawaiModulesController } from "./controllers/qrcode.modules.controller";
import { QrCodePegawaiModulesService } from "./services/qrcode.modules.service";
import { QrCodeModule } from "src/qrcode/qrcode.module";
import { EventsModule } from "src/events/events.module";
import { ProfileModulesService } from "./services/profile.modules.service";
import { ProfileModulesController } from "./controllers/profile.modules.controller";
import { LeaveModulesPegawaiController } from "./controllers/leave.modules.controller";
import { PegawaiModulesLeaveService } from "./services/leave.modules.service";
import { PegawaiModulesActivityService } from "./services/activity.modules.service";
import { ActiviyModulesPegawaiController } from "./controllers/activity.modules.controller";
import { PegawaiModulesFeatureService } from "./services/feature.modules.service";
import { PegawaiFeatureModuleServiceController } from "./controllers/feature.modules.controller";
import { PegawaiNotificationModuleServiceController } from "./controllers/notification.modules.controller";
import { PegawaiNotificationModuleService } from "./services/notification.modules.service";

@Module({
    imports: [TransactionModule, QrCodeModule, EventsModule],
    controllers: [PegawaiModulesPresenceController, PegawaiAccountModuleServiceController, TransactionPegawaiModuleController, HomeModulesPegawaiController, QrCodePegawaiModulesController, ProfileModulesController, LeaveModulesPegawaiController, ActiviyModulesPegawaiController, PegawaiFeatureModuleServiceController, PegawaiNotificationModuleServiceController],
    providers: [PegawaiModulesPresenceService, PegawaiAccountModuleService, TransactionService, TransactionPegawaiModuleService, HomeModulesPegawaiService, QrCodePegawaiModulesService, ProfileModulesService, PegawaiModulesLeaveService, PegawaiModulesActivityService, PegawaiModulesFeatureService, PegawaiNotificationModuleService],
})
export class PegawaiModulesModule {

}