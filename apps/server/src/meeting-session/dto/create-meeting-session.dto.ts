import { IsString } from "class-validator"

export class CreateMeetingSessionDto {
    @IsString()
    name: string
    @IsString()
    date: string
}
