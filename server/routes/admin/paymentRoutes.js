import { Router } from 'express';
import { getPaymentHistory, getPaymentById, refundPayment, handleStripeWebhook, handleMpesaCallback, createStripeSession, initiateMpesaPayment, deletePayment } from '../../controllers/admin/paymentController.js';
import adminAuthMiddleware from '../../middleware/admin/adminAuthMiddleware.js';
import superAdminMiddleware from '../../middleware/admin/superAdminMiddleware.js';

const router = Router();

router.get('/', adminAuthMiddleware, getPaymentHistory);
router.get('/:id', adminAuthMiddleware, getPaymentById);
router.post('/:id/refund', adminAuthMiddleware, superAdminMiddleware, refundPayment);
router.post('/stripe/webhook', handleStripeWebhook);
router.post('/mpesa/callback', handleMpesaCallback);
router.post('/stripe/create-session', adminAuthMiddleware, createStripeSession);
router.post('/mpesa/initiate', adminAuthMiddleware, initiateMpesaPayment);
router.delete('/:id', adminAuthMiddleware, superAdminMiddleware, deletePayment);

export default router;