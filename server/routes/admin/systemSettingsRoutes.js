import { Router } from 'express';
import { getSystemSettings, updateSystemSettings } from '../../controllers/admin/systemSettingsController.js';
import adminAuthMiddleware from '../../middleware/admin/adminAuthMiddleware.js';
import superAdminMiddleware from '../../middleware/admin/superAdminMiddleware.js';

const router = Router();

router.get('/', adminAuthMiddleware, getSystemSettings);
router.put('/', adminAuthMiddleware, superAdminMiddleware, updateSystemSettings);

export default router;