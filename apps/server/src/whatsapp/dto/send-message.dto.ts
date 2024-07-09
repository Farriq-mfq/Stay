import { IsPhoneNumber, IsString } from "class-validator";

export class SendMessageDto {

    @IsPhoneNumber('ID')
    readonly phone: number;

    @IsString()
    readonly message: string;
}


export class MediaFile {

    @IsString()
    readonly data: string;

    @IsString()
    readonly mimeType: string;

    @IsString()
    readonly fileName?: string;
}