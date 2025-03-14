import { IsNotEmpty, IsString } from "class-validator";

export class ReadQRCodeDto {
    @IsNotEmpty()
    @IsString()
    code: string
}