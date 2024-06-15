import { IsNotEmpty, IsString } from "class-validator";

export class UpdateTokenDto {
    @IsString({
        message: "Mohon scan kartu terlebih dahulu"
    })
    @IsNotEmpty({
        message: "Mohon scan kartu terlebih dahulu"
    })
    token: string
}