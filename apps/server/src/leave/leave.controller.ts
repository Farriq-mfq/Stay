import { Body, Controller, Get, Param, ParseIntPipe, Patch, Query, Req, UseGuards } from "@nestjs/common";
import { AccessTokenGuard } from "src/guards/accessToken.guard";
import { PermissionGuard } from "src/guards/permissions.guard";
import { LeaveService } from "./leave.service";
import { Request } from "express";
import { ApprovedDto } from "./dto/leave.dto";
import { Permissions } from "src/decorators/permission.decorator";

@Controller('leave')
@UseGuards(AccessTokenGuard, PermissionGuard)
export class LeaveController {
    constructor(private readonly leaveService: LeaveService) { }
    @Get()
    @Permissions('leave:read')
    async findAll(
        @Query('page', new ParseIntPipe({ optional: true })) page?: number,
        @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
        @Query('search') search?: string,
    ) {
        return await this.leaveService.findAll(page, limit, search);
    }

    @Patch(':id/approve')
    @Permissions('leave:approve')
    async approve(@Req() req: Request, @Param('id', new ParseIntPipe()) id: number, @Body() approvedDto: ApprovedDto) {
        return await this.leaveService.approve(req.user, id, approvedDto);
    }
    @Patch(':id/reject')
    @Permissions('leave:reject')
    async reject(@Req() req: Request, @Param('id', new ParseIntPipe()) id: number, @Body() approvedDto: ApprovedDto) {
        return await this.leaveService.reject(req.user, id, approvedDto);
    }
}