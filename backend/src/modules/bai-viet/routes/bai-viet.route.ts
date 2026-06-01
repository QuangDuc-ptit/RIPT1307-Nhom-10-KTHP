import { Router } from 'express';
import { postsController } from '../controllers/bai-viet.controller';
import {
  createPostSchema,
  idParamSchema,
  listQuerySchema,
  slugParamSchema,
  updatePostSchema,
} from '../schemas/bai-viet.schema';
import { validate } from '@/middlewares/validate';
import { requireAuth, requireRole } from '@/middlewares/auth';
import { asyncHandler } from '@/utils/async';

/* ----- Public router: client xem được ----- */
const publicRouter = Router();

publicRouter.get('/', validate({ query: listQuerySchema }), asyncHandler(postsController.listPublic));
publicRouter.get(
  '/slug/:slug',
  validate({ params: slugParamSchema }),
  asyncHandler(postsController.getBySlug),
);
publicRouter.get(
  '/:id',
  validate({ params: idParamSchema }),
  asyncHandler(postsController.getById),
);

/* ----- Admin router: cần đăng nhập + role ADMIN ----- */
export const adminPostsRouter = Router();

adminPostsRouter.use(requireAuth, requireRole('ADMIN'));

adminPostsRouter.get(
  '/',
  validate({ query: listQuerySchema }),
  asyncHandler(postsController.listAdmin),
);
adminPostsRouter.post(
  '/',
  validate({ body: createPostSchema }),
  asyncHandler(postsController.create),
);
adminPostsRouter.get(
  '/:id',
  validate({ params: idParamSchema }),
  asyncHandler(postsController.detailAdmin),
);
adminPostsRouter.patch(
  '/:id',
  validate({ params: idParamSchema, body: updatePostSchema }),
  asyncHandler(postsController.update),
);
adminPostsRouter.delete(
  '/:id',
  validate({ params: idParamSchema }),
  asyncHandler(postsController.remove),
);

export default publicRouter;
