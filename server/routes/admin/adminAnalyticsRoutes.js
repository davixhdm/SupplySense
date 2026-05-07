import { Router } from 'express';
import { getPlatformAnalytics } from '../../controllers/admin/adminAnalyticsController.js';
import adminAuthMiddleware from '../../middleware/admin/adminAuthMiddleware.js';
import superAdminMiddleware from '../../middleware/admin/superAdminMiddleware.js';

const router = Router();

router.get('/', adminAuthMiddleware, superAdminMiddleware, getPlatformAnalytics);

export default router;