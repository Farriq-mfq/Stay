import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Req, UseGuards } from "@nestjs/common";
import { AccessTokenPegawaiGuard } from "src/pegawai/guards/accessTokenPegawai.guard";
import { PegawaiModulesLeaveService } from "../services/leave.modules.service";
import { Request } from "express";
import { CreateLeaveDto } from "src/pegawai/dto/leave.dto";
import { PegawaiGroupGuard } from "src/guards/pegawai-group.guard";

@Controller('pegawai/modules/leave')
@UseGuards(AccessTokenPegawaiGuard, PegawaiGroupGuard)
export class LeaveModulesPegawaiController {
    constructor(
        private readonly pegawaiModulesLeaveService: PegawaiModulesLeaveService
    ) { }

    @Get('/')
    async getFindAllLeave(
        @Req() req: Request,
        @Query('limit') limit: string,
        @Query('after') after: string,
        @Query('before') before: string,
        @Query('search') search: string
    ) {
        return await this.pegawaiModulesLeaveService.getFindAllLeave(req.user, limit, after, before, search)
    }

    @Get('/:id')
    async getLeaveById(
        @Req() req: Request,
        @Param('id', new ParseIntPipe()) id: number
    ) {
        return await this.pegawaiModulesLeaveService.getLeaveById(req.user, id)
    }

    @Post('/')
    async createLeave(
        @Req() req: Request,
        @Body() createLeaveDto: CreateLeaveDto
    ) {
        return await this.pegawaiModulesLeaveService.createLeave(req.user, createLeaveDto)
    }
}