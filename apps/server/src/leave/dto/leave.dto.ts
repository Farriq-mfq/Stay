import { IsNotEmpty, IsString } from "class-validator";

export class ApprovedDto {
    @IsString()
    @IsNotEmpty({
        message: "Catatan tidak boleh kosong"
    })
    notes: string;
}