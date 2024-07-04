import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "src/auth/accessToken.strategy";


export type JwtPayloadSiswa = {
    sub: string;
    username: string;
};

@Injectable()
export class AccessTokenStrategySiswa extends PassportStrategy(Strategy, 'siswa') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET_SISWA,
        });
    }

    validate(payload: JwtPayload) {
        return payload;
    }
}