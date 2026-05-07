import { Router } from 'express';
import { getLegalDocument, updateLegalDocument } from '../../controllers/admin/legalController.js';
import adminAuthMiddleware from '../../middleware/admin/adminAuthMiddleware.js';
import superAdminMiddleware from '../../middleware/admin/superAdminMiddleware.js';

const router = Router();

router.get('/:type', adminAuthMiddleware, getLegalDocument);
router.put('/:type', adminAuthMiddleware, superAdminMiddleware, updateLegalDocument);

export default router;