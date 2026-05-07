import { Router } from 'express';
import { getDevices, getDeviceById, deactivateDevice, getDeviceActivity } from '../../controllers/client/deviceController.js';
import clientAuthMiddleware from '../../middleware/client/clientAuthMiddleware.js';

const router = Router();

router.get('/', clientAuthMiddleware, getDevices);
router.get('/:id', clientAuthMiddleware, getDeviceById);
router.get('/:id/activity', clientAuthMiddleware, getDeviceActivity);
router.put('/:id/deactivate', clientAuthMiddleware, deactivateDevice);

export default router;