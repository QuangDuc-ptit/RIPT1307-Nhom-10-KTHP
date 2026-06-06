import { Router } from 'express';
import { suatChieuController } from '../controllers/suat-chieu.controller';
import {
  createShowtimeSchema,
  idParamSchema,
  listShowtimeQuerySchema,
  updateShowtimeSchema,
} from '../schemas/suat-chieu.schema';
import { validate } from '@/middlewares/validate';
import { requireAuth, requireRole } from '@/middlewares/auth';
import { asyncHandler } from '@/utils/async';

const router = Router();

router.use(requireAuth, requireRole('ADMIN'));

router.get('/', validate({ query: listShowtimeQuerySchema }), asyncHandler(suatChieuController.list));
router.post('/', validate({ body: createShowtimeSchema }), asyncHandler(suatChieuController.create));
router.get('/:id', validate({ params: idParamSchema }), asyncHandler(suatChieuController.detail));
router.patch(
  '/:id',
  validate({ params: idParamSchema, body: updateShowtimeSchema }),
  asyncHandler(suatChieuController.update),
);
router.delete('/:id', validate({ params: idParamSchema }), asyncHandler(suatChieuController.remove));

export default router;
