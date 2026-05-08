import { Router } from 'express';
import {
  createSystemBackup,
  getBackups,
  downloadBackup,
  deleteBackup,
  emailBackup,
  shareBackup,
  restoreBackup,
  updateSchedule,
  importBackup
} from '../../controllers/admin/backupController.js';
import adminAuthMiddleware from '../../middleware/admin/adminAuthMiddleware.js';
import superAdminMiddleware from '../../middleware/admin/superAdminMiddleware.js';

const router = Router();

router.post('/', adminAuthMiddleware, superAdminMiddleware, createSystemBackup);
router.get('/', adminAuthMiddleware, superAdminMiddleware, getBackups);
router.get('/download/:filename', adminAuthMiddleware, superAdminMiddleware, downloadBackup);
router.delete('/:filename', adminAuthMiddleware, superAdminMiddleware, deleteBackup);
router.post('/email/:filename', adminAuthMiddleware, superAdminMiddleware, emailBackup);
router.post('/share/:filename', adminAuthMiddleware, superAdminMiddleware, shareBackup);
router.post('/restore/:filename', adminAuthMiddleware, superAdminMiddleware, restoreBackup);
router.put('/schedule', adminAuthMiddleware, superAdminMiddleware, updateSchedule);
router.post('/import', adminAuthMiddleware, superAdminMiddleware, importBackup);

export default router;