import { buildApp } from './app';
import { env } from './config/env';
import { prisma } from './config/db';

const app = buildApp();

const server = app.listen(env.PORT, () => {
  console.log(`\n🚀 API ready: http://localhost:${env.PORT}/api`);
  console.log(`   Health:  http://localhost:${env.PORT}/api/health`);
  console.log(`   Env:     ${env.NODE_ENV}\n`);
});

/**
 * Graceful shutdown: đóng server + Prisma client khi nhận SIGTERM/SIGINT.
 */
const shutdown = async (signal: string) => {
  console.log(`\n${signal} received, shutting down...`);
  server.close(() => console.log('HTTP server closed'));
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
