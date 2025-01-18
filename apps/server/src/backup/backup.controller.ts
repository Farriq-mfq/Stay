import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { createReadStream, existsSync, ReadStream, unlinkSync } from 'fs';
import { BackupService } from './backup.service';
@Controller("backup")
export class BackupController {
    constructor(
        private readonly backupService: BackupService,
    ) { }
    @Get("database")
    // @Header('Content-Type', 'application/sql')
    // @Header('Content-Disposition', `attachment; filename=${Date.now()}-backup.sql"`)
    async backupDatabase(
        @Res() res: Response
    ) {
        const filepath = await this.backupService.backupDatabase()
        const waitPromise = new Promise<ReadStream>((resolve) => setTimeout(() => {
            const db = createReadStream(filepath);
            resolve(db)
        }, 500));

        const db = await waitPromise;
        res.set({
            'Content-Type': 'application/sql',
            'Content-Disposition': `attachment; filename="${Date.now()}-backup.sql"`,
        });
        db.pipe(res)
        if (existsSync(filepath)) unlinkSync(filepath)
    }
}