import { Router } from 'express';
import { createBackup, getBackupHistory, downloadBackup } from '../../controllers/client/clientBackupController.js';
import clientAuthMiddleware from '../../middleware/client/clientAuthMiddleware.js';

const router = Router();

router.post('/', clientAuthMiddleware, createBackup);
router.get('/', clientAuthMiddleware, getBackupHistory);
router.get('/download/:filename', clientAuthMiddleware, downloadBackup);

export default router;