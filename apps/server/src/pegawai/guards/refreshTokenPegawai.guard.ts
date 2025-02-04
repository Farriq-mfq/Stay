import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshTokenPegawaiGuard extends AuthGuard('pegawai-refresh') { }
