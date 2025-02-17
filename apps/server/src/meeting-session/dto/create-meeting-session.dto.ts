import { IsDateString, IsNotEmpty, IsString } from "class-validator"

export class CreateMeetingSessionDto {
    @IsString()
    @IsNotEmpty({
        message: "Nama Sesi Rapat Tidak Boleh Kosong",
    })
    name: string
    @IsDateString({
        strict: true,
    })
    @IsNotEmpty({
        message: "Tanggal Sesi Rapat Tidak Boleh Kosong"
    })
    date: string
    @IsString()
    @IsNotEmpty({
        message: "Tempat Sesi Rapat Tidak Boleh Kosong"
    })
    location: string
    @IsString()
    @IsNotEmpty({
        message: "Agenda Sesi Rapat Tidak Boleh Kosong"
    })
    agenda: string
    @IsString()
    @IsNotEmpty({
        message: "Waktu Sesi Rapat Tidak Boleh Kosong"
    })
    time: string
}
