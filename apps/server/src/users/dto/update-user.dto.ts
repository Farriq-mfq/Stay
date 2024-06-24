import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';
import { IsEqualTo } from 'src/decorators/match.decorator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) { }


export class UpdateUserPasswordDto {
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
}