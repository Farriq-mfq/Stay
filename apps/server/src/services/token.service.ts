import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TokenService {
    generateRandomToken(length: number): string {
        return randomBytes(length).toString('hex');
    }

    generateUUID(): string {
        return uuidv4();
    }
}
