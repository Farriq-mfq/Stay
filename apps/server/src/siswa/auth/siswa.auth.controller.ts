import { Body, Controller, Get, HttpCode, Post, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { AccessTokenSiswaGuard } from "../guards/accessTokenSiswa.guard";
import { AuthSiswaDto } from "./dto/auth.dto";
import { SiswaAuthService } from "./siswa.auth.service";
import { JwtPayloadSiswa } from "../strategies/accessToken.strategy";
import { JwtPayload } from "src/auth/accessToken.strategy";

@Controller('/siswa/auth')
export class SiswaAuthController {
    constructor(
        private readonly siswaAuthService: SiswaAuthService
    ) { }

    @Post('/login')
    async login(
        @Body() authSiswaDto: AuthSiswaDto
    ) {
        return await this.siswaAuthService.login(authSiswaDto)
    }

    @UseGuards(AccessTokenSiswaGuard)
    @Post('/logout')
    @HttpCode(200)
    async logout(
        @Req() req: Request
    ) {
        return await this.siswaAuthService.logout(req.user as JwtPayloadSiswa)
    }
    @UseGuards(AccessTokenSiswaGuard)
    @Get('me')
    getMe(@Req() req: Request) {
        return this.siswaAuthService.getMe(req['user'] as JwtPayload)
    }
    @UseGuards(AccessTokenSiswaGuard)
    @Post('refresh')
    refreshTokens(@Req() req: Request) {
        const siswaId = req.user['sub'];
        // const refreshToken = req.user['refreshToken'];
        return this.siswaAuthService.refreshTokens(siswaId);
    }
}