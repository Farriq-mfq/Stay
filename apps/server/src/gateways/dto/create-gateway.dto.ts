import { Transform, TransformFnParams } from "class-transformer";
import { IsNotEmpty, IsString, IsIP, IsEnum } from "class-validator";

export enum RoleGatewayType {
    presence = "presence",
    register = "register",
}

export class CreateGatewayDto {
    @IsString({
        message: "Nama gateway harus string"
    })
    @IsNotEmpty({
        message: "Nama gateway harus di isi"
    })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    name: string
    @IsString({
        message: "IP gateway harus string"
    })
    @IsNotEmpty({
        message: "IP gateway harus di isi"
    })
    @IsIP(4, {
        message: "IP gateway harus IP v4"
    })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    ip: string
    @IsString({
        message: "Lokasi gateway harus string"
    })
    @IsNotEmpty({
        message: "Lokasi gateway harus di isi"
    })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    location: string
    @IsString({
        message: "Role gateway harus string"
    })
    @IsNotEmpty({
        message: "Role gateway harus di isi"
    })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsEnum(RoleGatewayType, {
        message: "Role gateway harus presence atau register"
    })
    role: RoleGatewayType
}
