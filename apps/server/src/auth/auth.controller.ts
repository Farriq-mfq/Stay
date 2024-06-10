import { Body, Controller, Get, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { JwtPayload } from './accessToken.strategy';
import { RefreshTokenGuard } from 'src/guards/refreshToken.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/login')
  async login(
    @Body() auth: AuthDto
  ) {
    return await this.authService.login(auth)
  }

  @UseGuards(AccessTokenGuard)
  @Post('/logout')
  @HttpCode(200)
  async logout(@Req() req: Request) {
    return await this.authService.logout(req['user'] as JwtPayload)
  }

  @UseGuards(AccessTokenGuard)
  @Post('refresh')
  refreshTokens(@Req() req: Request) {
    const userId = req.user['sub'];
    // const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId);
  }

  @UseGuards(AccessTokenGuard)
  @Get('me')
  getMe(@Req() req: Request) {
    return this.authService.getMe(req['user'] as JwtPayload)
  }

}
