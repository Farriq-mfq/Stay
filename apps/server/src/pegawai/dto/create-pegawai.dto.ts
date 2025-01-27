import { Transform, TransformFnParams } from "class-transformer"
import { IsNotEmpty, IsOptional, IsString, IsUppercase, IsUrl } from "class-validator"

export class CreatePegawaiDto {
    @IsString()
    @IsNotEmpty({
        message: "Nama harus diisi"
    })
    name: string
    @IsString({
        message: "ID Pegawai harus string"
    })
    @IsNotEmpty({
        message: "ID Pegawai harus diisi"
    })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    username: string
    @IsString()
    @IsNotEmpty({
        message: "Group harus diisi"
    })
    @IsUppercase()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    group: string
    @IsString()
    @IsNotEmpty({
        message: "Jabatan harus diisi"
    })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    position: string
    @IsUrl()
    @IsOptional()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    sign_picture: string
}



// export class ImportSiswaDto {
//     @IsNumberString()
//     @IsOptional()
//     @Transform(({ value }: TransformFnParams) => value?.trim())
//     notelp: string
//     @IsString()
//     @IsNotEmpty()
//     @Transform(({ value }: TransformFnParams) => value?.trim())
//     name: string
//     @IsString()
//     @IsNotEmpty()
//     @Transform(({ value }: TransformFnParams) => value?.trim())
//     rombel: string
//     @IsNumberString()
//     @IsNotEmpty()
//     @Transform(({ value }: TransformFnParams) => value?.trim())
//     nisn: string
//     @IsNumberString()
//     @Transform(({ value }: TransformFnParams) => value?.trim())
//     nis: string
// }
