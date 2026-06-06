import { Router } from 'express';
import { phimController } from '../controllers/phim.controller';
import {
  createPhimSchema,
  idParamSchema,
  listPhimQuerySchema,
  updatePhimSchema,
} from '../schemas/phim.schema';
import { validate } from '@/middlewares/validate';
import { requireAuth, requireRole } from '@/middlewares/auth';
import { asyncHandler } from '@/utils/async';

/* ----- Public router: client xem phim ----- */
const publicRouter = Router();

publicRouter.get(
  '/',
  validate({ query: listPhimQuerySchema }),
  asyncHandler(phimController.listPublic),
);
publicRouter.get(
  '/:id',
  validate({ params: idParamSchema }),
  asyncHandler(phimController.getById),
);

/* ----- Admin router: quản lý phim ----- */
export const adminPhimRouter = Router();

adminPhimRouter.use(requireAuth, requireRole('ADMIN'));

adminPhimRouter.get(
  '/',
  validate({ query: listPhimQuerySchema }),
  asyncHandler(phimController.listAdmin),
);
adminPhimRouter.post(
  '/',
  validate({ body: createPhimSchema }),
  asyncHandler(phimController.create),
);
adminPhimRouter.get(
  '/:id',
  validate({ params: idParamSchema }),
  asyncHandler(phimController.detailAdmin),
);
adminPhimRouter.patch(
  '/:id',
  validate({ params: idParamSchema, body: updatePhimSchema }),
  asyncHandler(phimController.update),
);
adminPhimRouter.delete(
  '/:id',
  validate({ params: idParamSchema }),
  asyncHandler(phimController.remove),
);

export default publicRouter;
