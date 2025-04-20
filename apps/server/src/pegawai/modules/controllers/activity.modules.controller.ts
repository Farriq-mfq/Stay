import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { PegawaiGroupGuard } from "src/guards/pegawai-group.guard";
import { AccessTokenPegawaiGuard } from "src/pegawai/guards/accessTokenPegawai.guard";
import { CreateActivityDto } from "../dto/activity.dto";
import { PegawaiModulesActivityService } from "../services/activity.modules.service";

@Controller('pegawai/modules/activity')
@UseGuards(AccessTokenPegawaiGuard, PegawaiGroupGuard)
export class ActiviyModulesPegawaiController {
    constructor(
        private readonly PegawaiModulesActivityService: PegawaiModulesActivityService
    ) { }

    @Get('/')
    async get(
        @Req() req: Request,
        @Query('limit') limit: string,
        @Query('after') after: string,
        @Query('before') before: string,
        @Query('search') search: string
    ) {
        return await this.PegawaiModulesActivityService.getFindAllActivity(req.user, limit, after, before, search)
    }

    @Get('/:id')
    async getLeaveById(
        @Req() req: Request,
        @Param('id', new ParseIntPipe()) id: number
    ) {
        return await this.PegawaiModulesActivityService.getActivityById(req.user, id)
    }

    @Post('/')
    async createLeave(
        @Req() req: Request,
        @Body() createActivityDto: CreateActivityDto
    ) {
        return await this.PegawaiModulesActivityService.createActivity(req.user, createActivityDto)
    }
}