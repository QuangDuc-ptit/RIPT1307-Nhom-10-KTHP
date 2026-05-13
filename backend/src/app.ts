import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { env } from './config/env';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';

import authRoutes from './modules/auth/auth.route';
import usersRoutes, { adminUsersRouter } from './modules/users/users.route';
import postsRoutes, { adminPostsRouter } from './modules/posts/posts.route';

export const buildApp = () => {
  const app = express();

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

  app.use('/api/auth', authRoutes);
  app.use('/api/users', usersRoutes);
  app.use('/api/posts', postsRoutes);

  app.use('/api/admin/users', adminUsersRouter);
  app.use('/api/admin/posts', adminPostsRouter);

  /* ---------- 404 + Error handler (đặt CUỐI) ---------- */
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
