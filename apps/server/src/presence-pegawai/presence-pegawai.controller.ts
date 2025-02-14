import { Controller, Get, Param, ParseIntPipe, Query, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PresencePegawaiService } from "./presence-pegawai.service";
import { Response } from "express";
import { format } from "date-fns";

@Controller('presence-pegawai')
@ApiTags('prensence-pegawai')
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
    //  @UseGuards(AccessTokenGuard)
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
    //  @UseGuards(AccessTokenGuard)
    async findAllByDaily(
        @Param('sessionId', new ParseIntPipe()) sessionId: string,
        @Query("date") date: string,
        @Query('search') search?: string,
        @Query('group') group?: string
    ) {
        return await this.presencePegawaiService.findAllByDaily(sessionId, search, date, group);
    }
    async findByMeetingSession() { }


    async exportByMeetingSession() { }
}