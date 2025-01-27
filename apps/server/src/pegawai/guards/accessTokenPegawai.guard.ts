import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AccessTokenPegawaiGuard extends AuthGuard('pegawai') { }
