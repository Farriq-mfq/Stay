import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';


export type DayOff = {
    tanggal: string,
    keterangan: string,
    is_cuti: boolean
}

@Injectable()
export class DayOffService {
    constructor(
        private readonly configService: ConfigService,
    ) { }

    async getDayOffs(month?: number, year?: number): Promise<DayOff[]> {
        if (month && (month < 1 || month > 12)) {
            throw new BadRequestException('Month must be between 1 and 12');
        }

        const dayOffUrl = this.configService.get<string>('API_DAYOFF');

        let endpoint = dayOffUrl;

        if (month && year) {
            endpoint = `${dayOffUrl}?month=${month}&year=${year}`;
        } else if (month) {
            endpoint = `${dayOffUrl}?month=${month}`;
        } else if (year) {
            endpoint = `${dayOffUrl}?year=${year}`;
        }

        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        if (!response.ok) {
            throw new Error(`Error fetching day offs: ${response.statusText}`);
        }

        const data = await response.json();
        return data
    }
}