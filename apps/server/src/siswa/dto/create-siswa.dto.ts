import { IsNotEmpty, IsNumberString, IsOptional, IsString, IsUppercase } from "class-validator"

export class CreateSiswaDto {
    @IsNumberString()
    @IsNotEmpty()
    notelp: string
    @IsString()
    @IsNotEmpty()
    name: string
    @IsString()
    @IsNotEmpty()
    @IsUppercase()
    rombel: string
    @IsNumberString()
    @IsNotEmpty()
    nisn: string
    @IsNumberString()
    @IsNotEmpty()
    nis: string
}



export class ImportSiswaDto {
    @IsNumberString()
    @IsOptional()
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
    nis: string
}
