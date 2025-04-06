import { IsNotEmpty, IsNumber, Min } from "class-validator";

export class CreateWithdrawDto {
    @IsNotEmpty({ message: 'Jumlah penarikan tidak boleh kosong' })
    @IsNumber({}, { message: 'Jumlah penarikan harus berupa angka' })
    @Min(10000, { message: 'Jumlah penarikan minimal Rp 10.000' })
    amount: number;
}
