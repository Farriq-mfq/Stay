import { IsDateString, IsNotEmpty, IsString } from "class-validator";

export class CreateLeaveDto {
    @IsDateString()
    @IsNotEmpty({
        message: "Tanggal mulai tidak boleh kosong"
    })
    start_date: string;
    @IsDateString()
    @IsNotEmpty({
        message: "Tanggal akhir tidak boleh kosong"
    })
    end_date: string;
    @IsNotEmpty()
    @IsString({
        message: "Alasan tidak boleh kosong"
    })
    reason: string;
}