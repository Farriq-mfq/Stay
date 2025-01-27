import { IsNotEmpty, IsString } from "class-validator"

export class PegawaiAuthDto {
    @IsString()
    @IsNotEmpty()
    username: string
    @IsString()
    @IsNotEmpty()
    password: string
}