import { Router } from 'express';
import { getOrders, getOrderById, createOrder, updateOrderStatus, updateOrder, getOrderStats } from '../../controllers/client/orderController.js';
import clientAuthMiddleware from '../../middleware/client/clientAuthMiddleware.js';
import planAccessMiddleware from '../../middleware/client/planAccessMiddleware.js';

const router = Router();

router.get('/', clientAuthMiddleware, planAccessMiddleware(['orders']), getOrders);
router.get('/stats', clientAuthMiddleware, planAccessMiddleware(['orders']), getOrderStats);
router.get('/:id', clientAuthMiddleware, planAccessMiddleware(['orders']), getOrderById);
router.post('/', clientAuthMiddleware, planAccessMiddleware(['orders']), createOrder);
router.put('/:id', clientAuthMiddleware, planAccessMiddleware(['orders']), updateOrder);
router.put('/:id/status', clientAuthMiddleware, planAccessMiddleware(['orders']), updateOrderStatus);

export default router;