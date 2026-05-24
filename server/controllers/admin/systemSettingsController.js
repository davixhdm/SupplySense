import SystemSettings from '../../models/admin/SystemSettingsModel.js';

const getSystemSettings = async (req, res) => {
  try {
    const settings = await SystemSettings.getSettings();
    res.json(settings);
  } catch (error) {
    console.error('Get system settings error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const updateSystemSettings = async (req, res) => {
  try {
    const settings = await SystemSettings.getSettings();

    const { systemName, licenseKeyPrefix, trialDuration, clientAppUrl, adminAppUrl, brevoSender, general } = req.body;

    if (systemName !== undefined) settings.systemName = systemName;
    if (licenseKeyPrefix !== undefined) settings.licenseKeyPrefix = licenseKeyPrefix;
    if (trialDuration !== undefined) settings.trialDuration = trialDuration;
    if (clientAppUrl !== undefined) settings.clientAppUrl = clientAppUrl;
    if (adminAppUrl !== undefined) settings.adminAppUrl = adminAppUrl;
    if (brevoSender !== undefined) settings.brevoSender = brevoSender;

    if (general) {
      settings.general = {
        ...settings.general.toObject(),
        ...general
      };
    }

    await settings.save();
    res.json(settings);
  } catch (error) {
    console.error('Update system settings error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export { getSystemSettings, updateSystemSettings };