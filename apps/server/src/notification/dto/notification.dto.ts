import { IsNotEmpty, IsNumberString, IsString } from "class-validator";

export class NotificationDto {
    @IsNotEmpty()
    @IsNumberString()
    siswaId: number;
    @IsString()
    @IsNotEmpty()
    title: string
    @IsString()
    @IsNotEmpty()
    message: string
}