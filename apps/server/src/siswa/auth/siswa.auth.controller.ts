import { Body, Controller, Get, HttpCode, Post, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { JwtPayload } from "src/auth/accessToken.strategy";
import { AccessTokenSiswaGuard } from "../guards/accessTokenSiswa.guard";
import { RefreshTokenSiswaGuard } from "../guards/refreshTokenSiswa.guard";
import { JwtPayloadSiswa } from "../strategies/accessToken.strategy";
import { AuthSiswaDto } from "./dto/auth.dto";
import { SiswaAuthService } from "./siswa.auth.service";

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
    @UseGuards(RefreshTokenSiswaGuard)
    @Post('refresh')
    refreshTokens(@Req() req: Request) {
        const siswaId = req.user['sub'];
        // const refreshToken = req.user['refreshToken'];
        return this.siswaAuthService.refreshTokens(siswaId);
    }
}