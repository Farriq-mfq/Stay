import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { verify } from 'argon2';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from './accessToken.strategy';
import { AuthDto } from './dto/auth.dto';
import { RoleUser } from '@prisma/client';
import { changePasswordDto } from './dto/change-password.dto';
@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {

    }

    async login({ username, password }: AuthDto) {
        const user = await this.userService.findByUsername(username);
        if (!user) {
            throw new UnauthorizedException()
        }

        if (!(await verify(user.password, password))) {
            throw new UnauthorizedException()
        }

        const tokens = await this.getTokens(user.id.toString(), {
            username: user.username,
            role: user.role
        })

        await this.userService.updateToken(user.id.toString(), tokens.refreshToken)

        return tokens

    }



    protected async getTokens(userId: string, {
        username,
        role
    }: {
        username: string,
        role: RoleUser
    }): Promise<
        {
            accessToken: string,
            refreshToken: string
        }> {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync({
                sub: userId,
                username,
                role
            }, {
                secret: this.configService.get<string>('JWT_SECRET'),
                expiresIn: '1d',
            },
            ),
            this.jwtService.signAsync({
                sub: userId,
                username,
                role
            }, {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
                expiresIn: '7d',
            },
            ),
        ])

        return {
            accessToken,
            refreshToken
        }
    }


    async logout(payload: JwtPayload) {
        const user = await this.userService.find(payload.sub.toString());
        if (!user || !user.refreshToken) throw new UnauthorizedException()
        return await this.userService.updateToken(payload.sub.toString(), null)
    }


    async refreshTokens(userId: string) {
        const user = await this.userService.find(userId);
        if (!user || !user.refreshToken)
            throw new UnauthorizedException();
        // const refreshTokenMatches = await verify(
        //     user.refreshToken,
        //     refreshToken,
        // );
        // if (!refreshTokenMatches) throw new UnauthorizedException();
        const tokens = await this.getTokens(user.id.toString(), {
            username: user.username,
            role: user.role
        });
        await this.userService.updateToken(user.id.toString(), tokens.refreshToken);
        return tokens;
    }

    async getMe(payload: JwtPayload) {
        return await this.userService.find(payload.sub.toString())
    }

    async changePassword(userId: string, changePasswordDto: changePasswordDto) {
        const user = await this.userService.findDetail(userId)
        if (!user || !user.refreshToken)
            throw new UnauthorizedException();
        const passwordMatches = await verify(user.password, changePasswordDto.old_password);
        if (!passwordMatches) throw new BadRequestException({
            old_password: [
                'The old password does not match',
            ],
        })
        return await this.userService.updatePassword(user.id, {
            confirmation_password: changePasswordDto.confirmation_password,
            password: changePasswordDto.new_password
        })
    }
}
