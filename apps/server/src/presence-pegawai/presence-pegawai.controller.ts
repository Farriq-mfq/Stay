import { Controller, Get, Param, ParseIntPipe, Query, Res, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PresencePegawaiService } from "./presence-pegawai.service";
import { Response } from "express";
import { format } from "date-fns";
import { AccessTokenGuard } from "src/guards/accessToken.guard";
import { Permissions } from "src/decorators/permission.decorator";
import { PermissionGuard } from "src/guards/permissions.guard";

@Controller('presence-pegawai')
@ApiTags('prensence-pegawai')
@UseGuards(AccessTokenGuard, PermissionGuard)
export class PresencePegawaiController {
    constructor(
        private readonly presencePegawaiService: PresencePegawaiService
    ) { }


    @Get('export/:sessionId')
    @Permissions('presence-pegawai:export-all')
    async exportAll(
        @Res() res: Response,
        @Param('sessionId', new ParseIntPipe()) sessionId: string,
        @Query('search') search?: string,
        @Query("date") date?: string
    ) {
        const buffer = await this.presencePegawaiService.exportAll(sessionId, search, date);
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename=${format(new Date(), 'yyyy-MM-dd')}-presences.xlsx`,
        });
        res.send(buffer);
    }

    @Get('/:sessionId')
    @Permissions('presence-pegawai:read')
    async findAll(
        @Param('sessionId', new ParseIntPipe()) sessionId: string,
        @Query('page', new ParseIntPipe({ optional: true })) page?: number,
        @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
        @Query('search') search?: string,
        @Query("date") date?: string
    ) {
        return await this.presencePegawaiService.findAll(sessionId, page, limit, search, date);
    }


    @Get('/:sessionId/daily')
    @Permissions('presence-pegawai:read-daily')

    async findAllByDaily(
        @Param('sessionId', new ParseIntPipe()) sessionId: string,
        @Query("date") date: string,
        @Query('search') search?: string,
        @Query('group') group?: string
    ) {
        return await this.presencePegawaiService.findAllByDaily(sessionId, search, date, group);
    }


    @Get('/export/:sessionId/daily')
    @Permissions('presence-pegawai:export-daily')
    async exportPresenceBygroup(
        @Res() res: Response,
        @Param('sessionId', new ParseIntPipe()) sessionId: string,
        @Query("date") date: string,
        @Query('search') search?: string,
        @Query('group') group?: string
    ) {

        if (group != null && group != undefined && group != '') {
            res.set({
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename=${format(new Date(), 'yyyy-MM-dd')}-presences.xlsx`,
            });
        } else {
            res.set({
                'Content-Type': 'application/zip',
                'Content-Disposition': `attachment; filename=${format(new Date(), 'yyyy-MM-dd')}-files.zip`,
            })
        }

        const buffer = await this.presencePegawaiService.exportByDaily(
            sessionId,
            search,
            date,
            group,
        )


        res.send(buffer);
    }

    @Get('/:sessionId/:group/monthly')
    @Permissions('presence-pegawai:read-monthly')
    async findAllPresenceByMonthClass(
        @Param('sessionId', new ParseIntPipe()) sessionId: string,
        @Query("date") date: string,
        @Param('group') group?: string
    ) {

        return await this.presencePegawaiService.findAllPresenceByMonthClass(
            sessionId,
            date,
            group
        )
    }

    @Get('/:sessionId/:group/monthly/export')
    @Permissions('presence-pegawai:export-monthly')
    //   @UseGuards(AccessTokenGuard)
    async exportPresenceByMonthClass(
        @Res() res: Response,
        @Param('sessionId', new ParseIntPipe()) sessionId: string,
        @Query("date") date: string,
        @Param('group') group?: string,
    ) {

        const buffer = await this.presencePegawaiService.exportPresenceByMonthClass(
            sessionId,
            date,
            group)
        res.send(buffer)
        // res.set({
        //   'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        //   'Content-Disposition': `attachment; filename=${format(new Date(), 'yyyy-MM-dd')}-presences.xlsx`,
        // });
        // res.send(buffer);
    }

    @Get('/:meetingSessionId/meeting')
    @Permissions('presence-pegawai:read-meeting')
    async findByMeetingSession(
        @Param('meetingSessionId', new ParseIntPipe()) meetingSessionId: string,
    ) {
        return await this.presencePegawaiService.findByMeetingSession(meetingSessionId);
    }


}