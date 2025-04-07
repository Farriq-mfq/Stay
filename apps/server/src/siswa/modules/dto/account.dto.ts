import { IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";
import { IsEqualTo } from "src/decorators/match.decorator";

export class SearchAccountSiswaDto {
    @IsNumberString()
    @IsNotEmpty()
    account_number: string
}


export class TransferAccountSiswaDto {
    @IsNumberString()
    @IsNotEmpty()
    account_number: string

    @IsNumber()
    @IsNotEmpty()
    nominal: number

    @IsString()
    @IsOptional()
    note: string
}

export class ConfirmPinSiswaDto {
    @IsString()
    @IsNotEmpty({
        message: "Mohon masukkan pin"
    })
    pin: string
}

export class RegisterPinSiswaDto {
    @IsString()
    @IsNotEmpty({
        message: "Mohon masukkan PIN Baru"
    })
    pin: string

    @IsString()
    @IsNotEmpty({
        message: "Mohon masukkan Konfirmasi PIN"
    })
    @IsEqualTo('pin', {
        message: "PIN tidak cocok"
    })
    pin_confirmation: string
    @IsString()
    @IsNotEmpty({
        message: "Mohon masukkan password"
    })
    password: string
}

