import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { createReadStream, existsSync, ReadStream, unlinkSync } from 'fs';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { BackupService } from './backup.service';
import { PermissionGuard } from 'src/guards/permissions.guard';
import { Permissions } from 'src/decorators/permission.decorator';
@Controller("backup")
@UseGuards(AccessTokenGuard, PermissionGuard)
export class BackupController {
    constructor(
        private readonly backupService: BackupService,
    ) { }
    @Get("database")
    @Permissions('backup:database')
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