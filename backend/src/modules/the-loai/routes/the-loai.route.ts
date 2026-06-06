import { Router } from 'express';
import { theLoaiController } from '../controllers/the-loai.controller';
import {
  createTheLoaiSchema,
  idParamSchema,
  listTheLoaiQuerySchema,
  updateTheLoaiSchema,
} from '../schemas/the-loai.schema';
import { validate } from '@/middlewares/validate';
import { requireAuth, requireRole } from '@/middlewares/auth';
import { asyncHandler } from '@/utils/async';

/* ----- Public router: client xem thể loại ----- */
const publicRouter = Router();

publicRouter.get('/', validate({ query: listTheLoaiQuerySchema }), asyncHandler(theLoaiController.list));
publicRouter.get('/slug/:slug', asyncHandler(theLoaiController.getBySlug));
publicRouter.get('/:id', validate({ params: idParamSchema }), asyncHandler(theLoaiController.getById));

/* ----- Admin router: quản lý thể loại ----- */
export const adminTheLoaiRouter = Router();

adminTheLoaiRouter.use(requireAuth, requireRole('ADMIN'));

adminTheLoaiRouter.post(
  '/',
  validate({ body: createTheLoaiSchema }),
  asyncHandler(theLoaiController.create),
);
adminTheLoaiRouter.patch(
  '/:id',
  validate({ params: idParamSchema, body: updateTheLoaiSchema }),
  asyncHandler(theLoaiController.update),
);
adminTheLoaiRouter.delete(
  '/:id',
  validate({ params: idParamSchema }),
  asyncHandler(theLoaiController.remove),
);

export default publicRouter;
