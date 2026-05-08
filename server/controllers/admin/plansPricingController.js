import SystemSettings from '../../models/admin/SystemSettingsModel.js';

const getPlansPricing = async (req, res) => {
  try {
    const settings = await SystemSettings.getSettings();
    res.json(settings.pricing);
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const updatePlansPricing = async (req, res) => {
  try {
    const settings = await SystemSettings.getSettings();
    
    if (req.body.pricing) {
      settings.pricing = { ...settings.pricing, ...req.body.pricing };
    }
    if (req.body.paymentConfig) {
      settings.paymentConfig = { ...settings.paymentConfig, ...req.body.paymentConfig };
    }

    await settings.save();
    res.json(settings);
  } catch (error) {
    console.error('Update plans error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export { getPlansPricing, updatePlansPricing };