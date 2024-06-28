import { IsNotEmpty, IsString } from "class-validator";
import { IsEqualTo } from "src/decorators/match.decorator";

export class changePasswordDto {
    @IsNotEmpty({
        message: "Password lama harus diisi"
    })
    @IsString()
    old_password: string;
    @IsNotEmpty({
        message: "Password baru harus diisi"
    })
    @IsString()
    new_password: string;
    @IsNotEmpty({
        message: "Konfirmasi password harus diisi"
    })
    @IsString()
    @IsEqualTo('new_password', {
        message: "Konfirmasi password harus sama dengan password"
    })
    confirmation_password: string;
}