import { QrAction } from "./config/qr-actions"

export type ConfigType = {
    whatsapp_bot: boolean,
    REFERENCE_DATE: string
}


export type QrCodeDecodeType<T> = {
    action: QrAction
    data: T,
    timestamp: number
}