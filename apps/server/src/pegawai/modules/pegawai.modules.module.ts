import { Module } from "@nestjs/common";
import { PegawaiModulesPresenceController } from "./controllers/presence.modules.controller";
import { PegawaiModulesPresenceService } from "./services/presence.modules.service";
import { PegawaiAccountModuleService } from "./services/account.modules.service";
import { PegawaiAccountModuleServiceController } from "./controllers/account.modules.controller";
import { TransactionModule } from "src/transaction/transaction.module";
import { TransactionService } from "src/transaction/transaction.service";

@Module({
    imports: [TransactionModule],
    controllers: [PegawaiModulesPresenceController, PegawaiAccountModuleServiceController],
    providers: [PegawaiModulesPresenceService, PegawaiAccountModuleService, TransactionService],
})
export class PegawaiModulesModule {

}