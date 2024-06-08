import { IsIP, IsNotEmpty } from "class-validator"

export class ScannedDto {
    @IsNotEmpty()
    @IsIP()
    ip: string
    @IsNotEmpty()
    scan: string
}