import { Router } from 'express';
import { phongChieuController } from '../controllers/phong-chieu.controller';
import { createRoomSchema, updateRoomSchema, idParamSchema, generateSeatsSchema } from '../schemas/phong-chieu.schema';
import { validate } from '@/middlewares/validate';
import { requireAuth, requireRole } from '@/middlewares/auth';
import { asyncHandler } from '@/utils/async';

const router = Router();

// Toàn bộ module phòng chiếu yêu cầu quyền ADMIN
router.use(requireAuth, requireRole('ADMIN'));

router.get('/', asyncHandler(phongChieuController.list));
router.post('/', validate({ body: createRoomSchema }), asyncHandler(phongChieuController.create));
router.get('/:id', validate({ params: idParamSchema }), asyncHandler(phongChieuController.detail));
router.patch('/:id', validate({ params: idParamSchema, body: updateRoomSchema }), asyncHandler(phongChieuController.update));
router.delete('/:id', validate({ params: idParamSchema }), asyncHandler(phongChieuController.remove));
router.post('/:id/sinh-ghe', validate({ params: idParamSchema, body: generateSeatsSchema }), asyncHandler(phongChieuController.generateSeats));

export default router;
