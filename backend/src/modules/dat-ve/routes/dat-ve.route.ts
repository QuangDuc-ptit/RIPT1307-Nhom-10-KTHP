import { Router } from 'express';
import { datVeController } from '../controllers/dat-ve.controller';
import { giuGheSchema } from '../schemas/dat-ve.schema';
import { validate } from '@/middlewares/validate';
import { requireAuth } from '@/middlewares/auth';
import { asyncHandler } from '@/utils/async';

const router = Router();

// Yêu cầu user phải đăng nhập mới được giữ ghế
router.use(requireAuth);

router.post('/giu-ghe', validate({ body: giuGheSchema }), asyncHandler(datVeController.giuGhe));

export default router;
