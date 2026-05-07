import { Router } from 'express';
import { getDashboardStats, getCharts } from '../../controllers/client/dashboardController.js';
import clientAuthMiddleware from '../../middleware/client/clientAuthMiddleware.js';
import planAccessMiddleware from '../../middleware/client/planAccessMiddleware.js';

const router = Router();

router.get('/stats', clientAuthMiddleware, planAccessMiddleware(['dashboard']), getDashboardStats);
router.get('/charts', clientAuthMiddleware, planAccessMiddleware(['dashboard']), getCharts);

export default router;