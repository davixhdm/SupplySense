import { Router } from 'express';
import { getLicenses, generateLicense, revokeLicenseHandler } from '../../controllers/admin/licenseController.js';
import adminAuthMiddleware from '../../middleware/admin/adminAuthMiddleware.js';
import superAdminMiddleware from '../../middleware/admin/superAdminMiddleware.js';

const router = Router();

router.get('/', adminAuthMiddleware, getLicenses);
router.post('/generate', adminAuthMiddleware, superAdminMiddleware, generateLicense);
router.put('/:id/revoke', adminAuthMiddleware, superAdminMiddleware, revokeLicenseHandler);

export default router;