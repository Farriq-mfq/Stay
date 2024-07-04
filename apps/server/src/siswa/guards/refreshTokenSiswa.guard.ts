import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshTokenSiswaGuard extends AuthGuard('siswa-refresh') { }
