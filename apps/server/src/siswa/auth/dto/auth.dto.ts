import { IsNotEmpty, IsString } from "class-validator"

export class AuthSiswaDto {
    @IsString()
    @IsNotEmpty()
    username: string
    @IsString()
    @IsNotEmpty()
    password: string
}