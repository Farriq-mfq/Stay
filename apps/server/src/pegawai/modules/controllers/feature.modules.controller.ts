import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { AccessTokenPegawaiGuard } from "src/pegawai/guards/accessTokenPegawai.guard";
import { PegawaiModulesFeatureService } from "../services/feature.modules.service";

@Controller('/pegawai/modules/features')
@UseGuards(AccessTokenPegawaiGuard)
export class PegawaiFeatureModuleServiceController {
    constructor(
        private readonly pegawaiModulesFeatureService: PegawaiModulesFeatureService
    ) { }
    @Get()
    async getFeatures(
        @Req() req: Request
    ) {
        return await this.pegawaiModulesFeatureService.getFeatures(req.user)
    }
}