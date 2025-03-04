import { Controller, Get, Param, ParseIntPipe, Query, Res, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PresencePegawaiService } from "./presence-pegawai.service";
import { Response } from "express";
import { format } from "date-fns";
import { AccessTokenGuard } from "src/guards/accessToken.guard";

@Controller('presence-pegawai')
@ApiTags('prensence-pegawai')
@UseGuards(AccessTokenGuard)
export class PresencePegawaiController {
    constructor(
        private readonly presencePegawaiService: PresencePegawaiService
    ) { }


    @Get('export/:sessionId')
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
    async findAllByDaily(
        @Param('sessionId', new ParseIntPipe()) sessionId: string,
        @Query("date") date: string,
        @Query('search') search?: string,
        @Query('group') group?: string
    ) {
        return await this.presencePegawaiService.findAllByDaily(sessionId, search, date, group);
    }


    @Get('/export/:sessionId/daily')
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
    async findByMeetingSession(
        @Param('meetingSessionId', new ParseIntPipe()) meetingSessionId: string,
    ) {
        return await this.presencePegawaiService.findByMeetingSession(meetingSessionId);
    }


}