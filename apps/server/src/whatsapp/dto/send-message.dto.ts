import { ArrayMinSize, IsArray, IsNotEmpty, IsPhoneNumber, IsString, ValidateNested } from "class-validator";

export class SendMessageDto {

    @IsArray()
    @ArrayMinSize(1)
    @IsPhoneNumber('ID', { each: true })
    @IsNotEmpty({
        each: true
    })
    readonly phone: number[];

    @IsString()
    @IsNotEmpty()
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