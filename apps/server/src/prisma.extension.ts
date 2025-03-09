import { PrismaClient } from '@prisma/client';
import { pagination } from 'prisma-extension-pagination';

export const extendedPrismaClient = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
}).$extends(pagination());

export type ExtendedPrismaClient = typeof extendedPrismaClient;