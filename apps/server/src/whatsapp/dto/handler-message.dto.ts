import { IsString, Matches } from "class-validator";

// export enum HandlerMesssageType {
//     conversetion,
//     autoreplay
// }

export class HandlerMessageDto {
    @IsString()
    readonly phone: string;
    
    @IsString()
    @Matches('^/.*$')
    readonly message: string;

    // @IsEnum(HandlerMesssageType)
    // readonly type: HandlerMesssageType;
}