import { Body, Controller, Get, HttpCode, Post, Req, UseGuards } from "@nestjs/common";
import { AccessTokenPegawaiGuard } from "../guards/accessTokenPegawai.guard";
import { JWTPayloadPegawai } from "../strategies/accessToken.strategy";
import { PegawaiAuthDto } from "./dto/auth.dto";
import { PegawaiAuthService } from "./pegawai.auth.service";
import { Request } from "express";
import { RefreshTokenPegawaiGuard } from "../guards/refreshTokenPegawai.guard";

@Controller('/pegawai/auth')
export class PegawaiAuthController {
    constructor(
        private readonly pegawaiAuthService: PegawaiAuthService
    ) { }

    @Post('/login')
    async login(
        @Body() pegawaiAuthDto: PegawaiAuthDto
    ) {
        return await this.pegawaiAuthService.login(pegawaiAuthDto)
    }

    @UseGuards(AccessTokenPegawaiGuard)
    @Post('/logout')
    @HttpCode(200)
    async logout(
        @Req() req: Request
    ) {
        return await this.pegawaiAuthService.logout(req.user as JWTPayloadPegawai)
    }
    @UseGuards(AccessTokenPegawaiGuard)
    @Get('me')
    getMe(@Req() req: Request) {
        return this.pegawaiAuthService.getMe(req.user as JWTPayloadPegawai)
    }
    @UseGuards(RefreshTokenPegawaiGuard)
    @Post('refresh')
    refreshTokens(@Req() req: Request) {
        const pegawaiId = req.user['sub'];
        return this.pegawaiAuthService.refreshTokens(pegawaiId);
    }
}