import { Module } from "@nestjs/common";
import { PegawaiService } from "src/pegawai/pegawai.service";
import { PresencePegawaiController } from "./presence-pegawai.controller";
import { PresencePegawaiService } from "./presence-pegawai.service";
import { DayOffService } from "src/services/day-off.service";

@Module({
    providers: [PresencePegawaiService, PegawaiService, DayOffService],
    controllers: [PresencePegawaiController]
})
export class PresencePegawaiModule { }