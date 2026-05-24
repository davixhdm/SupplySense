import { Router } from 'express';
import adminAuthMiddleware from '../../middleware/admin/adminAuthMiddleware.js';
import superAdminMiddleware from '../../middleware/admin/superAdminMiddleware.js';
import SystemSettings from '../../models/admin/SystemSettingsModel.js';

const router = Router();

router.get('/:type', adminAuthMiddleware, async (req, res) => {
  try {
    const settings = await SystemSettings.getSettings();
    const content = settings.legal?.[req.params.type] || '';
    res.json({ content });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
});

router.put('/:type', adminAuthMiddleware, superAdminMiddleware, async (req, res) => {
  try {
    const settings = await SystemSettings.getSettings();
    settings.legal = { ...settings.legal, [req.params.type]: req.body.content || '' };
    await settings.save();
    res.json({ message: `${req.params.type} updated.` });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
});

export default router;