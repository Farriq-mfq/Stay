import { SessionRoleType } from "@prisma/client"
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class FeatureUpdateDto {
    @IsNotEmpty()
    @IsEnum(SessionRoleType)
    role: SessionRoleType
    @IsNotEmpty()
    @IsString()
    title: string
    @IsNotEmpty()
    @IsString()
    icon: string
    @IsNotEmpty()
    @IsString()
    iconColor: string
    @IsNotEmpty()
    @IsBoolean()
    status: boolean
    @IsOptional()
    @IsArray()
    group: string
}