import { Router } from 'express';
import { usersController } from '../controllers/nguoi-dung.controller';
import {
  createUserSchema,
  idParamSchema,
  listQuerySchema,
  updateMeSchema,
  updateUserSchema,
} from '../schemas/nguoi-dung.schema';
import { validate } from '@/middlewares/validate';
import { requireAuth, requireRole } from '@/middlewares/auth';
import { asyncHandler } from '@/utils/async';

const router = Router();

/* ----- Endpoints cho mọi user đã đăng nhập ----- */
router.patch(
  '/me',
  requireAuth,
  validate({ body: updateMeSchema }),
  asyncHandler(usersController.updateMe),
);

/* ----- Endpoints chỉ cho ADMIN: mount dưới prefix /admin/users ở app.ts ----- */
export const adminUsersRouter = Router();

adminUsersRouter.use(requireAuth, requireRole('ADMIN'));

adminUsersRouter.get(
  '/',
  validate({ query: listQuerySchema }),
  asyncHandler(usersController.list),
);
adminUsersRouter.post(
  '/',
  validate({ body: createUserSchema }),
  asyncHandler(usersController.create),
);
adminUsersRouter.get(
  '/:id',
  validate({ params: idParamSchema }),
  asyncHandler(usersController.detail),
);
adminUsersRouter.patch(
  '/:id',
  validate({ params: idParamSchema, body: updateUserSchema }),
  asyncHandler(usersController.update),
);
adminUsersRouter.delete(
  '/:id',
  validate({ params: idParamSchema }),
  asyncHandler(usersController.remove),
);

export default router;
