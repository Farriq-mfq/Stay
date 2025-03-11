import { Module } from "@nestjs/common";
import { PegawaiModulesPresenceController } from "./controllers/presence.modules.controller";
import { PegawaiModulesPresenceService } from "./services/presence.modules.service";
import { PegawaiAccountModuleService } from "./services/account.modules.service";
import { PegawaiAccountModuleServiceController } from "./controllers/account.modules.controller";
import { TransactionModule } from "src/transaction/transaction.module";
import { TransactionService } from "src/transaction/transaction.service";
import { TransactionPegawaiModuleController } from "./controllers/transaction.modules.controller";
import { TransactionPegawaiModuleService } from "./services/transactions.modules.service";

@Module({
    imports: [TransactionModule],
    controllers: [PegawaiModulesPresenceController, PegawaiAccountModuleServiceController, TransactionPegawaiModuleController],
    providers: [PegawaiModulesPresenceService, PegawaiAccountModuleService, TransactionService, TransactionPegawaiModuleService],
})
export class PegawaiModulesModule {

}