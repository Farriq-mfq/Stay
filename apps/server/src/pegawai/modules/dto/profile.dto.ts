import { IsNotEmpty, IsString } from "class-validator";
import { IsEqualTo } from "src/decorators/match.decorator";


export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty({
    message: 'Password lama tidak boleh kosong'
  })
  old_password: string;
  @IsString()
  @IsNotEmpty({
    message: 'Password baru tidak boleh kosong'
  })
  new_password: string;
  @IsString()
  @IsNotEmpty({
    message: 'Konfirmasi password tidak boleh kosong'
  })
  @IsEqualTo('new_password', {
    message: 'Konfirmasi password tidak sesuai'
  })
  confirm_password: string;
}





