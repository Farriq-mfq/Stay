import { Transform, TransformFnParams } from "class-transformer"
import { IsArray, IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

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
    @IsDateString()
    @IsOptional()
    start_time: Date
    @IsDateString()
    @IsOptional()
    end_time: Date
    @IsArray()
    @IsNumber({}, { each: true })
    @IsOptional()
    gateways: number[]
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    rombel: string[]
}


