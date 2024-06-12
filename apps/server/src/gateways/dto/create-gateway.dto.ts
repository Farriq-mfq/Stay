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
    ip: string
    @IsString({
        message: "Lokasi gateway harus string"
    })
    @IsNotEmpty({
        message: "Lokasi gateway harus di isi"
    })
    location: string
    @IsString({
        message: "Role gateway harus string"
    })
    @IsNotEmpty({
        message: "Role gateway harus di isi"
    })
    @IsEnum(RoleGatewayType, {
        message: "Role gateway harus presence atau register"
    })
    role: RoleGatewayType
}
