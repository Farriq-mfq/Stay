import { Transform, TransformFnParams } from "class-transformer"
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Matches } from "class-validator"
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
}


