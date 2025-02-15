import { IsDateString, IsNotEmpty, IsString } from "class-validator"

export class CreateMeetingSessionDto {
    @IsString()
    @IsNotEmpty()
    name: string
    @IsDateString({
        strict: true,
    })
    @IsNotEmpty()
    date: string
    @IsString()
    @IsNotEmpty()
    location: string
    @IsString()
    @IsNotEmpty()
    agenda: string
    @IsString()
    @IsNotEmpty()
    time: string
}
