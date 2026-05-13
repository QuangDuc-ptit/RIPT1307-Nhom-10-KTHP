import { Router } from 'express';
import { authController } from './auth.controller';
import {
  changePasswordSchema,
  loginSchema,
  refreshSchema,
  registerSchema,
} from './auth.schema';
import { validate } from '@/middlewares/validate';
import { requireAuth } from '@/middlewares/auth';
import { asyncHandler } from '@/utils/async';

const router = Router();

router.post('/register', validate({ body: registerSchema }), asyncHandler(authController.register));
router.post('/login', validate({ body: loginSchema }), asyncHandler(authController.login));
router.post('/refresh', validate({ body: refreshSchema }), asyncHandler(authController.refresh));
router.post('/logout', asyncHandler(authController.logout));

router.get('/me', requireAuth, asyncHandler(authController.me));
router.post(
  '/change-password',
  requireAuth,
  validate({ body: changePasswordSchema }),
  asyncHandler(authController.changePassword),
);

export default router;
