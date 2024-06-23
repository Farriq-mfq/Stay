import { Transform, TransformFnParams } from "class-transformer"
import { IsNotEmpty, IsNumberString, IsOptional, IsString, IsUppercase } from "class-validator"

export class CreateSiswaDto {
    @IsNumberString()
    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    notelp: string
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    name: string
    @IsString()
    @IsNotEmpty()
    @IsUppercase()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    rombel: string
    @IsNumberString()
    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    nisn: string
    @IsNumberString()
    @IsNotEmpty()
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
}
