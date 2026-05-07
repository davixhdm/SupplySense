import { Router } from 'express';
import { getStats } from '../../controllers/admin/adminDashboardController.js';
import adminAuthMiddleware from '../../middleware/admin/adminAuthMiddleware.js';

const router = Router();

router.get('/', adminAuthMiddleware, getStats);

export default router;