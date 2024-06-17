import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator"

export class CreateSessionDto {
    @IsNotEmpty()
    @IsString()
    name: string
    @IsNotEmpty()
    @IsBoolean()
    @IsOptional()
    status: boolean
    @IsArray()
    // @ValidateNested({ each: true })
    @IsNumber({}, { each: true })
    @IsOptional()
    gateways: number[]
}


