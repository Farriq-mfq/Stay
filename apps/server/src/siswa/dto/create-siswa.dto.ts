import { Transform, TransformFnParams } from "class-transformer"
import { IsNotEmpty, IsNumberString, IsOptional, IsString, IsUppercase, IsUrl } from "class-validator"
import { IsEqualTo } from "src/decorators/match.decorator"

export class CreateSiswaDto {
    @IsNumberString()
    @IsNotEmpty({
        message: "Notelp harus diisi"
    })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    notelp: string
    @IsString()
    @IsNotEmpty({
        message: "Nama harus diisi"
    })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    name: string
    @IsString()
    @IsNotEmpty({
        message: "Rombel harus diisi"
    })
    @IsUppercase()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    rombel: string
    @IsNumberString()
    @IsNotEmpty({
        message: "NISN harus diisi"
    })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    nisn: string
    @IsNumberString()
    @IsNotEmpty({
        message: "NIS harus diisi"
    })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    nis: string
}



export class ImportSiswaDto {
    @IsNumberString()
    @IsOptional()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    notelp: string
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    name: string
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    rombel: string
    @IsNumberString()
    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    nisn: string
    @IsNumberString()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    nis: string
    @IsUrl()
    @IsOptional()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    image_url: string
}


export class UpdateRombelDto {
    @IsString()
    @IsNotEmpty({
        message: "Rombel harus diisi"
    })
    @IsUppercase({
        message:"Rombel harus diisi huruf kapital"
    })
    rombel: string
    @IsString()
    @IsNotEmpty({
        message: "Rombel yang baru harus diisi"
    })
    @IsUppercase({
        message:"Rombel yang baru harus diisi huruf kapital"
    })
    updated_rombel: string
}


export class ResetPasswordDto {
    @IsString()
    @IsNotEmpty({
        message: "Password harus diisi"
    })
    password: string
    @IsString()
    @IsNotEmpty({
        message: "Password harus diisi"
    })
    @IsEqualTo('password', {
        message: "Password harus sama"
    })
    password_confirmation: string
}
