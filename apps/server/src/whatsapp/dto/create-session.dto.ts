import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateWASessionDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: "notification",
        required: true
    })
    name: string
}