import { IsNotEmpty, IsString } from "class-validator"

export class PegawaiAuthDto {
    @IsString()
    @IsNotEmpty({
        message: "Username tidak boleh kosong"
    })
    username: string
    @IsString()
    @IsNotEmpty({
        message: "Password tidak boleh kosong"
    })
    password: string
}