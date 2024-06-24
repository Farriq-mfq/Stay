import { IsNotEmpty, IsString } from "class-validator"

export class AuthDto {
    @IsString()
    @IsNotEmpty({
        message: "Username harus diisi"
    })
    username: string
    @IsString()
    @IsNotEmpty({
        message: "Password harus diisi"
    })
    password: string
}
