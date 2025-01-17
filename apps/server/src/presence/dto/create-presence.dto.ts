import { IsNotEmpty, IsNumber, IsNumberString } from 'class-validator'
export class CreatePresenceDto { }


export class CreatePresenceByQRDTO {
    @IsNumberString()
    @IsNotEmpty()
    nisn: string
    @IsNotEmpty()
    @IsNumber()
    session: number
}


export class CreatePresenceByNisDto {
    @IsNumberString({}, {
        message: "NISN harus Angka"
    })
    @IsNotEmpty({
        message: "NISN tidak boleh kosong"
    })
    nisn: string
    @IsNotEmpty()
    @IsNumber()
    session: number
}