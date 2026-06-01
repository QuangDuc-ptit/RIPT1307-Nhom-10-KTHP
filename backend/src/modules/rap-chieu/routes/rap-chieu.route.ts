import { Router } from 'express';
import { rapChieuController } from '../controllers/rap-chieu.controller';
import { createCinemaSchema, updateCinemaSchema, idParamSchema } from '../schemas/rap-chieu.schema';
import { validate } from '@/middlewares/validate';
import { requireAuth, requireRole } from '@/middlewares/auth';
import { asyncHandler } from '@/utils/async';

const router = Router();

// Toàn bộ module rạp chiếu yêu cầu quyền ADMIN
router.use(requireAuth, requireRole('ADMIN'));

router.get('/', asyncHandler(rapChieuController.list));
router.post('/', validate({ body: createCinemaSchema }), asyncHandler(rapChieuController.create));
router.get('/:id', validate({ params: idParamSchema }), asyncHandler(rapChieuController.detail));
router.patch('/:id', validate({ params: idParamSchema, body: updateCinemaSchema }), asyncHandler(rapChieuController.update));
router.delete('/:id', validate({ params: idParamSchema }), asyncHandler(rapChieuController.remove));

export default router;
