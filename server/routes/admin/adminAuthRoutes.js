import { Router } from 'express';
import { adminLogin, adminLogout, getProfile, updateProfile, changePassword, forgotPassword, resetPassword } from '../../controllers/admin/adminAuthController.js';
import adminAuthMiddleware from '../../middleware/admin/adminAuthMiddleware.js';

const router = Router();

router.post('/login', adminLogin);
router.post('/logout', adminAuthMiddleware, adminLogout);
router.get('/profile', adminAuthMiddleware, getProfile);
router.put('/profile', adminAuthMiddleware, updateProfile);
router.put('/change-password', adminAuthMiddleware, changePassword);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;