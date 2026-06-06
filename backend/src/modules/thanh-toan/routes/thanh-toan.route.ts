import { Router } from 'express';
import { thanhToanController } from '../controllers/thanh-toan.controller';
import { createPaymentSchema, paymentIpnSchema } from '../schemas/thanh-toan.schema';
import { validate } from '@/middlewares/validate';
import { requireAuth } from '@/middlewares/auth';
import { asyncHandler } from '@/utils/async';

const router = Router();

router.post('/', requireAuth, validate({ body: createPaymentSchema }), asyncHandler(thanhToanController.createPayment));
router.post('/ipn', validate({ body: paymentIpnSchema }), asyncHandler(thanhToanController.handleIpn));
router.get('/ipn', validate({ query: paymentIpnSchema }), asyncHandler(thanhToanController.handleIpn));

export default router;
