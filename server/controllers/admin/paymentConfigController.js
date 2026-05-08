import SystemSettings from '../../models/admin/SystemSettingsModel.js';

const getPaymentConfig = async (req, res) => {
  try {
    const settings = await SystemSettings.getSettings();
    res.json(settings.paymentConfig);
  } catch (error) {
    console.error('Get payment config error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export { getPaymentConfig };