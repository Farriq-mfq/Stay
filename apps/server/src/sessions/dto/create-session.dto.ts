import { Transform, TransformFnParams } from "class-transformer"
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class CreateSessionDto {
    @IsNotEmpty()
    @IsString()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    name: string
    @IsArray()
    @IsNumber({}, { each: true })
    @IsOptional()
    gateways: number[]
}


