import { Router } from 'express';
import {
  clientLogin,
  clientLogout,
  registerOrganization,
  activateLicense,
  verifyDevice,
  sendDeviceOTP,
  forgotPassword,
  resetPassword,
  submitManualPayment,
  getProfile,
  updateProfile,
  changeClientPassword,
  registerWithPayment,
  getPublicSettings
} from '../../controllers/client/clientAuthController.js';
import clientAuthMiddleware from '../../middleware/client/clientAuthMiddleware.js';
import deviceCheckMiddleware from '../../middleware/client/deviceCheckMiddleware.js';

const router = Router();

router.get('/public-settings', getPublicSettings);
router.post('/login', clientLogin);
router.post('/logout', clientAuthMiddleware, clientLogout);
router.post('/register', registerOrganization);
router.post('/activate-license', activateLicense);
router.post('/verify-device', clientAuthMiddleware, verifyDevice);
router.post('/send-device-otp', clientAuthMiddleware, sendDeviceOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/manual-payment', clientAuthMiddleware, submitManualPayment);
router.get('/profile', clientAuthMiddleware, getProfile);
router.put('/profile', clientAuthMiddleware, updateProfile);
router.put('/change-password', clientAuthMiddleware, changeClientPassword);
router.post('/register-with-payment', registerWithPayment);

export default router;