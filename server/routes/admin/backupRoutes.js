import { Router } from 'express';
import { createSystemBackup, getBackups, downloadBackup } from '../../controllers/admin/backupController.js';
import adminAuthMiddleware from '../../middleware/admin/adminAuthMiddleware.js';
import superAdminMiddleware from '../../middleware/admin/superAdminMiddleware.js';

const router = Router();

router.post('/', adminAuthMiddleware, superAdminMiddleware, createSystemBackup);
router.get('/', adminAuthMiddleware, superAdminMiddleware, getBackups);
router.get('/download/:filename', adminAuthMiddleware, superAdminMiddleware, downloadBackup);

export default router;