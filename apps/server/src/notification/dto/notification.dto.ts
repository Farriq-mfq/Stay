import { AccountableType, NotificationType, VisualType } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsNumber, IsObject, IsString } from "class-validator";



export class NotificationDto {
    @IsString()
    @IsNotEmpty()
    title: string
    @IsString()
    @IsNotEmpty()
    body: string
    @IsString()
    @IsNotEmpty()
    token: string
    @IsNotEmpty()
    @IsEnum(AccountableType)
    user_type: AccountableType
    @IsNotEmpty()
    @IsNumber()
    ref_id: number
    @IsNotEmpty()
    @IsEnum(NotificationType)
    type: NotificationType
    @IsNotEmpty()
    @IsEnum(NotificationType)
    visual_type: VisualType
    @IsNotEmpty()
    @IsObject()
    data: Record<string, any>;

}