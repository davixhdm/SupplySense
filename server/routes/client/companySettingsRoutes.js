import { Router } from 'express';
import { getCompanyInfo, updateCompanyInfo, uploadLogo } from '../../controllers/client/companySettingsController.js';
import clientAuthMiddleware from '../../middleware/client/clientAuthMiddleware.js';

const router = Router();

router.get('/', clientAuthMiddleware, getCompanyInfo);
router.put('/', clientAuthMiddleware, updateCompanyInfo);
router.post('/logo', clientAuthMiddleware, uploadLogo);

export default router;