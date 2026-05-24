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

const updatePaymentConfig = async (req, res) => {
  try {
    const settings = await SystemSettings.getSettings();
    
    if (req.body.stripeEnabled !== undefined) settings.paymentConfig.stripeEnabled = req.body.stripeEnabled;
    if (req.body.mpesaEnabled !== undefined) settings.paymentConfig.mpesaEnabled = req.body.mpesaEnabled;
    if (req.body.paypalEnabled !== undefined) settings.paymentConfig.paypalEnabled = req.body.paypalEnabled;
    
    if (req.body.mpesaSubMethods) {
      settings.paymentConfig.mpesaSubMethods = {
        ...settings.paymentConfig.mpesaSubMethods,
        ...req.body.mpesaSubMethods
      };
    }
    
    if (req.body.mpesaNumbers) {
      settings.paymentConfig.mpesaNumbers = {
        ...settings.paymentConfig.mpesaNumbers,
        ...req.body.mpesaNumbers
      };
    }
    
    if (req.body.currency) settings.paymentConfig.currency = req.body.currency;

    await settings.save();
    res.json(settings.paymentConfig);
  } catch (error) {
    console.error('Update payment config error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export { getPaymentConfig, updatePaymentConfig };