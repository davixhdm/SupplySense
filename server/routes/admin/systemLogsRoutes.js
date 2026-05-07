import { Router } from 'express';
import { getLogs, getLogById } from '../../controllers/admin/systemLogsController.js';
import adminAuthMiddleware from '../../middleware/admin/adminAuthMiddleware.js';
import superAdminMiddleware from '../../middleware/admin/superAdminMiddleware.js';

const router = Router();

router.get('/', adminAuthMiddleware, superAdminMiddleware, getLogs);
router.get('/:id', adminAuthMiddleware, superAdminMiddleware, getLogById);

export default router;