import { Router } from 'express';
import { getPaymentConfig } from '../../controllers/admin/paymentConfigController.js';
import adminAuthMiddleware from '../../middleware/admin/adminAuthMiddleware.js';

const router = Router();

router.get('/', adminAuthMiddleware, getPaymentConfig);

export default router;