import { Router } from 'express';
import { getApplications, getApplicationById, updatePlan, suspendOrganization, reactivateOrganization, extendTrial } from '../../controllers/admin/applicationsController.js';
import adminAuthMiddleware from '../../middleware/admin/adminAuthMiddleware.js';
import superAdminMiddleware from '../../middleware/admin/superAdminMiddleware.js';

const router = Router();

router.get('/', adminAuthMiddleware, getApplications);
router.get('/:id', adminAuthMiddleware, getApplicationById);
router.put('/:id/plan', adminAuthMiddleware, superAdminMiddleware, updatePlan);
router.put('/:id/suspend', adminAuthMiddleware, superAdminMiddleware, suspendOrganization);
router.put('/:id/reactivate', adminAuthMiddleware, superAdminMiddleware, reactivateOrganization);
router.put('/:id/extend-trial', adminAuthMiddleware, superAdminMiddleware, extendTrial);

export default router;