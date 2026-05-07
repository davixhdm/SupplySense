import { Router } from 'express';
import { getAlerts, markAsRead, markAllRead, actionAlert, dismissAlert, getUnreadCount } from '../../controllers/client/alertController.js';
import clientAuthMiddleware from '../../middleware/client/clientAuthMiddleware.js';

const router = Router();

router.get('/', clientAuthMiddleware, getAlerts);
router.get('/unread-count', clientAuthMiddleware, getUnreadCount);
router.put('/:id/read', clientAuthMiddleware, markAsRead);
router.put('/read-all', clientAuthMiddleware, markAllRead);
router.put('/:id/action', clientAuthMiddleware, actionAlert);
router.put('/:id/dismiss', clientAuthMiddleware, dismissAlert);

export default router;