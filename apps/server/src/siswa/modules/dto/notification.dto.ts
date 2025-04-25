import { IsNotEmpty, IsString } from "class-validator";

export class UpdateFCMTokenDto {
    @IsNotEmpty()
    @IsString()
    token: string;
}