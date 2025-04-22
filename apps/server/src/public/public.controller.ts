import { Controller, Get, ParseEnumPipe, ParseIntPipe, Query } from "@nestjs/common";
import { SessionRoleType } from "@prisma/client";
import { PublicService } from "./public.service";

@Controller("public")
export class PublicController {
    constructor(
        private readonly publicService: PublicService
    ) { }
    // @Get("health")
    // health() {
    //     return "OK";
    // }

    @Get("sessions")
    async sessions(
        @Query('page', new ParseIntPipe({ optional: true })) page?: number,
        @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
        @Query('search') search?: string,
        @Query('role', new ParseEnumPipe(SessionRoleType, { optional: true })) role?: SessionRoleType

    ) {
        return await this.publicService.findAllSessions(page, limit, search, role);
    }

    @Get("dayoffs")
    async dayOffs(
        @Query('month', new ParseIntPipe({ optional: true })) month?: number,
        @Query('year', new ParseIntPipe({ optional: true })) year?: number
    ) {
        return await this.publicService.findDayOff(month, year);
    }
}