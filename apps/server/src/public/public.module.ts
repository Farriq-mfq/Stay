import { Module } from "@nestjs/common";
import { PublicController } from "./public.controller";
import { PublicService } from "./public.service";
import { DayOffService } from "src/services/day-off.service";

@Module({
    imports: [],
    providers: [PublicService, DayOffService],
    controllers: [PublicController]
})
export class PublicModule {

}