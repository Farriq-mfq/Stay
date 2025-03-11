import { Module } from "@nestjs/common";
import { TransactionModule } from "src/transaction/transaction.module";
import { SiswaAccountModuleController } from "./controllers/account.modules.controller";
import { SiswaModulesPresenceController } from "./controllers/presence.modules.controller";
import { TransactionSiswaModuleController } from "./controllers/transaction.modules.controller";
import { SiswaAccountModuleService } from "./services/account.modules.service";
import { SiswaModulesPresenceService } from "./services/presence.modules.service";
import { TransactionSiswaModuleService } from "./services/transactions.modules.service";

@Module({
    imports: [TransactionModule],
    controllers: [SiswaAccountModuleController, SiswaModulesPresenceController, TransactionSiswaModuleController],
    providers: [SiswaAccountModuleService, SiswaModulesPresenceService, TransactionSiswaModuleService],
})
export class SiswaModulesModule {

}