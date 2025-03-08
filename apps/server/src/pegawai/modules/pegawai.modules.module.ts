import { Module } from "@nestjs/common";
import { PegawaiModulesPresenceController } from "./controllers/presence.modules.controller";
import { PegawaiModulesPresenceService } from "./services/presence.modules.service";

@Module({
    controllers: [PegawaiModulesPresenceController],
    providers: [PegawaiModulesPresenceService],
})
export class PegawaiModulesModule {

}