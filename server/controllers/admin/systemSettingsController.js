import env from '../../config/env.js';
import ClientOrg from '../../models/admin/ClientOrgModel.js';

const getSystemSettings = async (req, res) => {
  try {
    res.json({
      systemName: 'SupplySense',
      licenseKeyPrefix: env.LICENSE_KEY_PREFIX,
      trialDuration: env.TRIAL_DURATION_DAYS,
      defaultCurrency: env.DEFAULT_CURRENCY,
      brevoSender: env.BREVO_SENDER_EMAIL,
      clientAppUrl: env.CLIENT_APP_URL,
      adminAppUrl: env.ADMIN_APP_URL
    });
  } catch (error) {
    console.error('Get system settings error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const updateSystemSettings = async (req, res) => {
  try {
    res.json({ message: 'Settings updated. Some changes require server restart.' });
  } catch (error) {
    console.error('Update system settings error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export { getSystemSettings, updateSystemSettings };