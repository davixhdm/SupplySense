import { Router } from 'express';
import { getAdminUsers, getAdminUserById, createAdminUser, updateAdminUser, deleteAdminUser } from '../../controllers/admin/adminUserController.js';
import adminAuthMiddleware from '../../middleware/admin/adminAuthMiddleware.js';
import superAdminMiddleware from '../../middleware/admin/superAdminMiddleware.js';

const router = Router();

router.get('/', adminAuthMiddleware, superAdminMiddleware, getAdminUsers);
router.get('/:id', adminAuthMiddleware, superAdminMiddleware, getAdminUserById);
router.post('/', adminAuthMiddleware, superAdminMiddleware, createAdminUser);
router.put('/:id', adminAuthMiddleware, superAdminMiddleware, updateAdminUser);
router.delete('/:id', adminAuthMiddleware, superAdminMiddleware, deleteAdminUser);

export default router;