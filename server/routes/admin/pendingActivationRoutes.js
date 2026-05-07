import { Router } from 'express';
import { getPendingActivations, approveActivation, rejectActivation } from '../../controllers/admin/pendingActivationController.js';
import adminAuthMiddleware from '../../middleware/admin/adminAuthMiddleware.js';
import moderatorMiddleware from '../../middleware/admin/moderatorMiddleware.js';

const router = Router();

router.get('/', adminAuthMiddleware, moderatorMiddleware, getPendingActivations);
router.post('/:id/approve', adminAuthMiddleware, moderatorMiddleware, approveActivation);
router.post('/:id/reject', adminAuthMiddleware, moderatorMiddleware, rejectActivation);

export default router;