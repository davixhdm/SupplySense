import { Router } from 'express';
import { getPreferences, updatePreferences } from '../../controllers/client/preferencesController.js';
import clientAuthMiddleware from '../../middleware/client/clientAuthMiddleware.js';

const router = Router();

router.get('/', clientAuthMiddleware, getPreferences);
router.put('/', clientAuthMiddleware, updatePreferences);

export default router;