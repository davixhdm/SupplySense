import { Router } from 'express';
import { getPlansPricing, updatePlansPricing } from '../../controllers/admin/plansPricingController.js';
import adminAuthMiddleware from '../../middleware/admin/adminAuthMiddleware.js';
import superAdminMiddleware from '../../middleware/admin/superAdminMiddleware.js';

const router = Router();

router.get('/', adminAuthMiddleware, getPlansPricing);
router.put('/', adminAuthMiddleware, superAdminMiddleware, updatePlansPricing);

export default router;