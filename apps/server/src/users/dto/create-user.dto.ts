import { IsNotEmpty, IsNumber, IsString } from "class-validator"
import { IsEqualTo } from "src/decorators/match.decorator"

export class CreateUserDto {
    @IsNotEmpty({
        message: "Nama harus di isi"
    })
    @IsString()
    name: string
    @IsNotEmpty({
        message: "Username harus di isi"
    })
    @IsString()
    username: string
    @IsNotEmpty({
        message: "Password harus di isi"
    })
    @IsString()
    password: string
    @IsNotEmpty({
        message: "Konfirmasi password harus di isi"
    })
    @IsString()
    @IsEqualTo('password', {
        message: "Konfirmasi password harus sama dengan password"
    })
    confirmation_password: string

    @IsNumber()
    @IsNotEmpty({
        message: "Hak Akses Tidak Boleh Kosong"
    })
    roles: string
}
