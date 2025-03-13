import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as CryptoJS from 'crypto-js';
import { QrAction } from '../config/qr-actions';

@Injectable()
export class QRCodeService {
    constructor(
        private readonly configService: ConfigService
    ) { }
    async createQrCode(
        data: any,
        qrActions: QrAction
    ) {
        const encryptData = JSON.stringify({ data, action: qrActions, timestamp: new Date().getTime() })
        return CryptoJS.AES.encrypt(encryptData, this.configService.get("APP_KEY")).toString()
    }

    async decryptQrCode(qrCode) {
        const bytes = CryptoJS.AES.decrypt(qrCode, this.configService.get("APP_KEY"));
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        return JSON.parse(originalText)
    }
}