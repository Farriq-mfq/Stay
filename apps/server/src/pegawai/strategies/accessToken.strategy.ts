import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "src/auth/accessToken.strategy";


export type JWTPayloadPegawai = {
    sub: string;
    username: string;
};

@Injectable()
export class AccessTokenStrategyPegawai extends PassportStrategy(Strategy, 'pegawai') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET_PEGAWAI,
        });
    }

    validate(payload: JwtPayload) {
        return payload;
    }
}