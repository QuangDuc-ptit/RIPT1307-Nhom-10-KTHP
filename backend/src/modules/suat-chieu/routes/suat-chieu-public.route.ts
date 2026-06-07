import { Router } from 'express';
import { suatChieuController } from '../controllers/suat-chieu.controller';
import { idParamSchema, listShowtimeQuerySchema } from '../schemas/suat-chieu.schema';
import { validate } from '@/middlewares/validate';
import { asyncHandler } from '@/utils/async';

const router = Router();

// Public routes cho suất chiếu (Client)
router.get('/', validate({ query: listShowtimeQuerySchema }), asyncHandler(suatChieuController.list));
router.get('/:id', validate({ params: idParamSchema }), asyncHandler(suatChieuController.detail));

export default router;
