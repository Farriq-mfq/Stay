import { IsNotEmpty, IsNumberString, IsString } from "class-validator"

export class CreateSiswaDto {
    @IsNumberString()
    @IsNotEmpty()
    notelp: string
    @IsString()
    @IsNotEmpty()
    name: string
    @IsString()
    @IsNotEmpty()
    rombel: string
    @IsNumberString()
    @IsNotEmpty()
    nisn: string
    @IsNumberString()
    @IsNotEmpty()
    nis: string
}
