import { IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";

export class SearchAccountPegawaiDto {
    @IsNumberString()
    @IsNotEmpty()
    account_number: string
}


export class TransferAccountPegawaiDto {
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