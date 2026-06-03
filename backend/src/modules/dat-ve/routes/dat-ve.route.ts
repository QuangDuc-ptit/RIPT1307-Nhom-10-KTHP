import { Router } from 'express';
import { datVeController } from '../controllers/dat-ve.controller';
import { bookingController } from '../controllers/booking.controller';
import { giuGheSchema } from '../schemas/dat-ve.schema';
import { createBookingSchema } from '../schemas/booking.schema';
import { validate } from '@/middlewares/validate';
import { requireAuth } from '@/middlewares/auth';
import { asyncHandler } from '@/utils/async';

const router = Router();

// Yêu cầu user phải đăng nhập mới được giữ ghế
router.use(requireAuth);

router.post('/giu-ghe', validate({ body: giuGheSchema }), asyncHandler(datVeController.giuGhe));
router.post('/booking', validate({ body: createBookingSchema }), asyncHandler(bookingController.createBooking));

export default router;
