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
    @IsNumberString()
    @IsNotEmpty()
    nis: string
    @IsNotEmpty()
    @IsNumber()
    session: number
}