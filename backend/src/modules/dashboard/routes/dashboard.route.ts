import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller';
import { requireAuth, requireRole } from '@/middlewares/auth';
import { Role } from '@prisma/client';

const router = Router();

router.use(requireAuth);
router.use(requireRole(Role.ADMIN, Role.STAFF));

router.get('/stats', dashboardController.getStats);

export default router;
