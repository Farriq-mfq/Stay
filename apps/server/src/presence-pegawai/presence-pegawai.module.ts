import { Module } from "@nestjs/common";
import { PegawaiService } from "src/pegawai/pegawai.service";
import { PresencePegawaiController } from "./presence-pegawai.controller";
import { PresencePegawaiService } from "./presence-pegawai.service";

@Module({
    providers: [PresencePegawaiService,PegawaiService],
    controllers: [PresencePegawaiController]
})
export class PresencePegawaiModule { }