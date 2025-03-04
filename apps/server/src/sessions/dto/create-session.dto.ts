import { SessionRoleType } from "@prisma/client"
import { Transform, TransformFnParams } from "class-transformer"
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"
import { IsRangeTime } from "src/validators/is-range-time.validator"
import { IsTime } from "src/validators/is-time.validator"

export class CreateSessionDto {
    @IsNotEmpty({
        message: "Nama Session Harus diisi"
    })
    @IsString()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    name: string
    @IsBoolean()
    @IsOptional()
    allow_twice: boolean
    // @IsDateString()
    @IsTime({ message: "Format waktu salah" })
    @IsOptional()
    start_time: string
    // @IsDateString()
    @IsTime({ message: "Format waktu salah" })
    @IsRangeTime()
    @IsOptional()
    end_time: string
    @IsArray()
    @IsNumber({}, { each: true })
    @IsOptional()
    gateways: number[]
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    group: string[]

    @IsNotEmpty({ message: "Session Role Type Harus diisi" })
    @IsString({ message: "Session Role Type Harus String" })
    @IsEnum(SessionRoleType, { message: "Session Role Type Salah, Hanya Ada 2 Yaitu Siswa dan Pegawai" })
    // @IsOptional()
    session_role_type: SessionRoleType
}


