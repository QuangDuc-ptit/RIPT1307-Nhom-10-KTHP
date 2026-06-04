import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { env } from './config/env';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';

import xacThucRoutes from './modules/xac-thuc/routes/xac-thuc.route';
import usersRoutes, { adminUsersRouter } from './modules/nguoi-dung/routes/nguoi-dung.route';
import postsRoutes, { adminPostsRouter } from './modules/bai-viet/routes/bai-viet.route';
import rapChieuRoutes from './modules/rap-chieu/routes/rap-chieu.route';
import phongChieuRoutes from './modules/phong-chieu/routes/phong-chieu.route';
import datVeRoutes from './modules/dat-ve/routes/dat-ve.route';
import soatVeRoutes from './modules/soat-ve/routes/soat-ve.route';
import { startCronJobs } from './jobs/cron';

export const buildApp = () => {
  const app = express();

  // Khởi động các tiến trình chạy ngầm
  startCronJobs();

  /* ---------- Middleware cơ bản ---------- */
  app.use(helmet());
  app.use(
    cors({
      origin: (origin, cb) => {
        // Cho phép request không có origin (Postman, curl)
        if (!origin) return cb(null, true);
        if (env.corsOrigins.includes(origin)) return cb(null, true);
        return cb(new Error(`CORS blocked: ${origin}`));
      },
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  if (!env.isProd) app.use(morgan('dev'));

  /* ---------- Routes ---------- */
  app.get('/api/health', (_req, res) => res.json({ success: true, data: { ok: true } }));

  app.use('/api/auth', xacThucRoutes);
  app.use('/api/users', usersRoutes);
  app.use('/api/posts', postsRoutes);
  app.use('/api/dat-ve', datVeRoutes);
  app.use('/api/staff', soatVeRoutes);

  app.use('/api/admin/users', adminUsersRouter);
  app.use('/api/admin/posts', adminPostsRouter);
  app.use('/api/admin/rap-chieu', rapChieuRoutes);
  app.use('/api/admin/phong-chieu', phongChieuRoutes);

  /* ---------- 404 + Error handler (đặt CUỐI) ---------- */
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
