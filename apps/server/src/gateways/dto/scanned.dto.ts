import { Transform, TransformFnParams } from "class-transformer"
import { IsIP, IsNotEmpty } from "class-validator"

export class ScannedDto {
    @IsNotEmpty()
    @IsIP()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    ip: string
    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    scan: string
}