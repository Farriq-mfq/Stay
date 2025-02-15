import { Module } from "@nestjs/common";
import { PresencePegawaiController } from "./presence-pegawai.controller";
import { PresencePegawaiService } from "./presence-pegawai.service";
import { PegawaiModule } from "src/pegawai/pegawai.module";
import { PegawaiService } from "src/pegawai/pegawai.service";

@Module({
    providers: [PresencePegawaiService,PegawaiService],
    controllers: [PresencePegawaiController]
})
export class PresencePegawaiModule { }