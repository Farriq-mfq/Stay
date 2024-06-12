import { IsNotEmpty } from "class-validator"

export class ScanDto {
    @IsNotEmpty()
    ip: string
    @IsNotEmpty()
    scan: string
    @IsNotEmpty()
    token: string
}