import { IsNotEmpty, IsString } from "class-validator";

export class CreateActivityDto {
    @IsString()
    @IsNotEmpty({
        message: 'Uraian tidak boleh kosong'
    })
    description: string;
}