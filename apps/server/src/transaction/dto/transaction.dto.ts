import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumberString, IsOptional, IsString, ValidateNested } from "class-validator";

export class DepositTransactionDto {
    @IsNotEmpty({
        message: "jumlah uang harus diisi"
    })
    @IsNumberString()
    amount: number;
    @IsOptional()
    @IsString()
    note: string

}


export class TransferTransactionDto {
    @IsNotEmpty({
        message: "jumlah uang harus diisi"
    })
    @IsNumberString()
    amount: number;
    @IsNotEmpty({
        message: "tujuan transfer harus diisi"
    })
    @IsNumberString()
    toAccountId: number;
    @IsOptional()
    @IsString()
    note: string
}


export class PaymentTransactionDto {
    @IsString()
    @IsNotEmpty()
    title: string
    @IsNotEmpty({
        message: "jumlah uang harus diisi"
    })
    @IsNumberString()
    amount: number;
    @IsNotEmpty({
        message: "tujuan transfer harus diisi"
    })
    @IsNumberString()
    toAccountId: number;
    @IsOptional()
    @IsString()
    note: string
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PaymentTransactionDetailDto)
    details: PaymentTransactionDetailDto[]
}

export class PaymentTransactionDetailDto {
    @IsNotEmpty({
        message: "jumlah uang harus diisi"
    })
    @IsNumberString()
    amount: number;
    @IsNotEmpty({
        message: "Nama / Judul harus diisi"
    })
    @IsString()
    title: string
    @IsNotEmpty({
        message: "quantity uang harus diisi"
    })
    @IsNumberString()
    quantity: number

}

export type PaymentMethodType = "CARD" | "CASH" | "QRCODE" | "BALANCE";