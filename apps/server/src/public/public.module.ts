import { Module } from "@nestjs/common";
import { PublicController } from "./public.controller";
import { PublicService } from "./public.service";

@Module({
    imports: [],
    providers: [PublicService],
    controllers: [PublicController]
})
export class PublicModule {

}