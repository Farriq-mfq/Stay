import { IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";

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