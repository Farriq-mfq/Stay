import { SetMetadata } from '@nestjs/common';

export const BypassInterceptor = () => SetMetadata('bypassInterceptor', true);
