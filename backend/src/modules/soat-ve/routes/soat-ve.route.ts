import { Router } from 'express';
import { soatVeController } from '../controllers/soat-ve.controller';
import { scanTicketSchema } from '../schemas/soat-ve.schema';
import { validate } from '@/middlewares/validate';
import { requireAuth, requireRole } from '@/middlewares/auth';
import { asyncHandler } from '@/utils/async';
import { Role } from '@prisma/client';

const router = Router();

// Yêu cầu đăng nhập và có quyền STAFF hoặc ADMIN
router.use(requireAuth, requireRole(Role.STAFF, Role.ADMIN));

router.post('/scan', validate({ body: scanTicketSchema }), asyncHandler(soatVeController.scanTicket));

export default router;
