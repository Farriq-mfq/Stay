import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { exec } from 'child_process';
import { ReadStream, createReadStream, existsSync, mkdirSync } from 'fs';
import * as path from 'path';
import { parseDatabaseUrl } from "src/utils/helpers";
@Injectable()
export class BackupService {
    constructor(
        private readonly configService: ConfigService,
    ) { }
    async backupDatabase(): Promise<string | null> {
        try {
            const database = parseDatabaseUrl(this.configService.get("DATABASE_URL"));

            const backupDir = path.join(__dirname, 'backups');
            if (!existsSync(backupDir)) {
                mkdirSync(backupDir, { recursive: true });
            }
            const backupFile = path.join(backupDir, `${database.database}_${Date.now()}.sql`);

            const command = `pg_dump ${this.configService.get("DATABASE_URL")} > ${backupFile}`;

            exec(command, (error) => {
                if (error) {
                    return null;
                }
            });

            const waitFileIfExist = new Promise<string>((resolve, reject) => {
                const interval = setInterval(() => {
                    if (existsSync(backupFile)) {
                        clearInterval(interval);
                        resolve(backupFile);
                    }
                }, 1000);
            });

            return waitFileIfExist
        } catch (err) {
            return null;
        }
    }
}