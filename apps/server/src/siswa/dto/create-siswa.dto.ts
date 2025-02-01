import { Transform, TransformFnParams } from "class-transformer"
import { IsNotEmpty, IsNumberString, IsOptional, IsString, IsUppercase, IsUrl } from "class-validator"

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
