import { Module } from "@nestjs/common";
import { PegawaiModulesPresenceController } from "./controllers/presence.modules.controller";
import { PegawaiModulesPresenceService } from "./services/presence.modules.service";
import { PegawaiAccountModuleService } from "./services/account.modules.service";
import { PegawaiAccountModuleServiceController } from "./controllers/account.modules.controller";

@Module({
    controllers: [PegawaiModulesPresenceController, PegawaiAccountModuleServiceController],
    providers: [PegawaiModulesPresenceService, PegawaiAccountModuleService],
})
export class PegawaiModulesModule {

}