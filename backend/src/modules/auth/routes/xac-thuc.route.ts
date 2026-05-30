import { Router } from 'express';
import { xacThucController } from '../controllers/xac-thuc.controller';
import {
  changePasswordSchema,
  loginSchema,
  refreshSchema,
  registerSchema,
} from '../schemas/xac-thuc.schema';
import { socialLoginSchema } from '../schemas/xac-thuc.schema';
import { quenMatKhauSchema, datLaiMatKhauSchema } from '../schemas/xac-thuc.schema';
import { validate } from '@/middlewares/validate';
import { requireAuth } from '@/middlewares/auth';
import { asyncHandler } from '@/utils/async';

const router = Router();

router.post('/register', validate({ body: registerSchema }), asyncHandler(xacThucController.register));
router.post('/login', validate({ body: loginSchema }), asyncHandler(xacThucController.login));
router.post('/social-login', validate({ body: socialLoginSchema }), asyncHandler(xacThucController.socialLogin));
router.post('/quen-mat-khau', validate({ body: quenMatKhauSchema }), asyncHandler(xacThucController.quenMatKhau));
router.post('/dat-lai-mat-khau', validate({ body: datLaiMatKhauSchema }), asyncHandler(xacThucController.datLaiMatKhau));
router.post('/refresh', validate({ body: refreshSchema }), asyncHandler(xacThucController.refresh));
router.post('/logout', asyncHandler(xacThucController.logout));

router.get('/me', requireAuth, asyncHandler(xacThucController.me));
router.post(
  '/change-password',
  requireAuth,
  validate({ body: changePasswordSchema }),
  asyncHandler(xacThucController.changePassword),
);

export default router;
