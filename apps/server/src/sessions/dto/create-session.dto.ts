import { Transform, TransformFnParams } from "class-transformer"
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class CreateSessionDto {
    @IsNotEmpty({
        message: "Nama Session Harus diisi"
    })
    @IsString()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    name: string
    @IsArray()
    @IsNumber({}, { each: true })
    @IsOptional()
    gateways: number[]
}


