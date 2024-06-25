import { IsNotEmpty, IsString } from "class-validator";
import { IsEqualTo } from "src/decorators/match.decorator";

export class changePasswordDto {
    @IsNotEmpty()
    @IsString()
    old_password: string;
    @IsNotEmpty()
    @IsString()
    new_password: string;
    @IsNotEmpty()
    @IsString()
    @IsEqualTo('new_password')
    confirmation_password: string;
}