import { IsArray, IsNotEmpty, IsNumber, IsNumberString, IsString } from "class-validator"

export class CreateRoleDto {
    @IsNotEmpty({
        message: "Nama Role Tidak Boleh Kosong"
    })
    @IsString()
    name: string
    @IsNotEmpty({
        message: "Permission Tidak Boleh Kosong"
    })
    @IsArray()
    @IsNumber({}, { each: true })
    permissions: string[]
}
