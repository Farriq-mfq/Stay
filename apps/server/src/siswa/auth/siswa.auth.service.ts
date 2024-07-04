import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { verify } from "argon2";
import { SiswaService } from "../siswa.service";
import { JwtPayloadSiswa } from "../strategies/accessToken.strategy";
import { AuthSiswaDto } from "./dto/auth.dto";

@Injectable()
export class SiswaAuthService {
    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        private readonly siswaService: SiswaService,
    ) { }



    async login(authSiswaDto: AuthSiswaDto) {
        const siswa = await this.siswaService.findByNISN(authSiswaDto.username);
        if (!siswa) {
            throw new UnauthorizedException()
        }

        if (!(await verify(siswa.password, authSiswaDto.password))) {
            throw new UnauthorizedException()
        }

        const tokens = await this.getTokens(siswa.id.toString(), siswa.nisn)

        await this.siswaService.updateToken(siswa.id, tokens.refreshToken)

        return tokens
    }


    protected async getTokens(userId: string, username: string): Promise<
        {
            accessToken: string,
            refreshToken: string
        }> {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync({
                sub: userId,
                username,
            }, {
                secret: this.configService.get<string>('JWT_SECRET_SISWA'),
                expiresIn: '1d',
            },
            ),
            this.jwtService.signAsync({
                sub: userId,
                username,
            }, {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET_SISWA'),
                expiresIn: '7d',
            },
            ),
        ])

        return {
            accessToken,
            refreshToken
        }
    }
    async logout(payload: JwtPayloadSiswa) {
        const siswa = await this.siswaService.findOne(+payload.sub);
        if (!siswa || !siswa.refreshToken) throw new UnauthorizedException()
        return await this.siswaService.updateToken(+payload.sub, null)
    }

    async getMe(payload: JwtPayloadSiswa) {
        return await this.siswaService.findOne(+payload.sub)
    }

    async refreshTokens(siswaId: string) {
        const siswa = await this.siswaService.findOne(+siswaId);
        if (!siswa || !siswa.refreshToken)
            throw new UnauthorizedException();
        // const refreshTokenMatches = await verify(
        //     user.refreshToken,
        //     refreshToken,
        // );
        // if (!refreshTokenMatches) throw new UnauthorizedException();
        const tokens = await this.getTokens(siswa.id.toString(), siswa.nisn);
        await this.siswaService.updateToken(siswa.id, tokens.refreshToken);
        return tokens;
    }
}