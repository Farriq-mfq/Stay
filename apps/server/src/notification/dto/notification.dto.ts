import { AccountableType, NotificationType, VisualType } from "@prisma/client";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from "class-validator";

export enum InputTypeUser {
    PEGAWAI = "PEGAWAI",
    SISWA = "SISWA",
    COMMON = "COMMON"
}
export class NotificationCreateDto {
    @IsString()
    @IsNotEmpty({
        message: "Judul harus diisi"
    })
    title: string
    @IsString()
    @IsNotEmpty({
        message: "Body harus diisi"
    })
    body: string
    @IsNotEmpty({
        message: "Tipe User harus diisi"
    })
    @IsEnum(InputTypeUser)
    user_type: InputTypeUser
    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    refs_id?: number[]
    @IsNotEmpty({
        message: "Tipe notifikasi harus diisi"
    })
    @IsEnum(NotificationType)
    type: NotificationType
}

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