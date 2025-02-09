import { Module } from "@nestjs/common";
import { PresencePegawaiController } from "./presence-pegawai.controller";
import { PresencePegawaiService } from "./presence-pegawai.service";

@Module({
    providers: [PresencePegawaiService],
    controllers: [PresencePegawaiController]
})
export class PresencePegawaiModule { }