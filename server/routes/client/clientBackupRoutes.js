import { Router } from 'express';
import {
  createBackup,
  getBackupHistory,
  downloadBackup,
  deleteBackup,
  emailBackup,
  shareBackup,
  restoreBackup,
  importBackup
} from '../../controllers/client/clientBackupController.js';
import clientAuthMiddleware from '../../middleware/client/clientAuthMiddleware.js';

const router = Router();

router.post('/', clientAuthMiddleware, createBackup);
router.get('/', clientAuthMiddleware, getBackupHistory);
router.get('/download/:filename', clientAuthMiddleware, downloadBackup);
router.delete('/:filename', clientAuthMiddleware, deleteBackup);
router.post('/email/:filename', clientAuthMiddleware, emailBackup);
router.post('/share/:filename', clientAuthMiddleware, shareBackup);
router.post('/restore/:filename', clientAuthMiddleware, restoreBackup);
router.post('/import', clientAuthMiddleware, importBackup);

export default router;