import { PrismaClient } from '@prisma/client';
import { env } from './env';

/**
 * Singleton Prisma Client.
 *
 * Lưu trên `globalThis` để khi dev (hot reload) không tạo nhiều instance
 * dẫn đến cạn pool connection.
 */
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const prisma =
  global.__prisma ??
  new PrismaClient({
    log: env.isProd ? ['error'] : ['warn', 'error'],
  });

if (!env.isProd) global.__prisma = prisma;
