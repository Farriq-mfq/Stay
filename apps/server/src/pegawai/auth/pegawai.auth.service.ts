import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { verify } from "argon2";
import { PegawaiService } from "../pegawai.service";
import { JWTPayloadPegawai } from "../strategies/accessToken.strategy";
import { PegawaiAuthDto } from "./dto/auth.dto";

@Injectable()
export class PegawaiAuthService {
    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        private readonly pegawaiService: PegawaiService,
    ) { }



    async login(pegawaiAuthDto: PegawaiAuthDto) {
        const siswa = await this.pegawaiService.findByUsername(pegawaiAuthDto.username);
        if (!siswa) {
            throw new UnauthorizedException()
        }

        if (!(await verify(siswa.password, pegawaiAuthDto.password))) {
            throw new UnauthorizedException()
        }

        const tokens = await this.getTokens(siswa.id.toString(), siswa.username)

        await this.pegawaiService.updateToken(siswa.id, tokens.refreshToken)

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
                secret: this.configService.get<string>('JWT_SECRET_PEGAWAI'),
                expiresIn: '1d',
            },
            ),
            this.jwtService.signAsync({
                sub: userId,
                username,
            }, {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET_PEGAWAI'),
                expiresIn: '7d',
            },
            ),
        ])

        return {
            accessToken,
            refreshToken
        }
    }
    async logout(payload: JWTPayloadPegawai) {
        const pegawai = await this.pegawaiService.findOne(+payload.sub);
        if (!pegawai || !pegawai.refreshToken) throw new UnauthorizedException()
        return await this.pegawaiService.updateToken(+payload.sub, null)
    }

    async getMe(payload: JWTPayloadPegawai) {
        return await this.pegawaiService.findOne(+payload.sub)
    }

    async refreshTokens(pegawaiId: string) {
        const pegawai = await this.pegawaiService.findOne(+pegawaiId);
        if (!pegawai || !pegawai.refreshToken)
            throw new UnauthorizedException();
        // const refreshTokenMatches = await verify(
        //     user.refreshToken,
        //     refreshToken,
        // );
        // if (!refreshTokenMatches) throw new UnauthorizedException();
        const tokens = await this.getTokens(pegawai.id.toString(), pegawai.username);
        await this.pegawaiService.updateToken(pegawai.id, tokens.refreshToken);
        return tokens;
    }
}