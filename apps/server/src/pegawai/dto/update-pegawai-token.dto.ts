import { Transform, TransformFnParams } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdatePegawaiTokenDto {
    @IsString({
        message: "Mohon scan kartu terlebih dahulu"
    })
    @IsNotEmpty({
        message: "Mohon scan kartu terlebih dahulu"
    })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    token: string
}