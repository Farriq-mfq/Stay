import { Module } from '@nestjs/common';
import { AppChannel1Update } from './app-channel1.update';
import { RegisterSiswaWizard } from './wizard/register-siswa.wizard';

@Module({
    providers: [AppChannel1Update, RegisterSiswaWizard],
})
export class AppChannel1Module { }