import ClientOrg from '../../models/admin/ClientOrgModel.js';
import AuditLog from '../../models/admin/AuditLogModel.js';

const getPreferences = async (req, res) => {
  try {
    const org = await ClientOrg.findById(req.user.organizationId).select('settings backupSchedule enabledModules mode');
    if (!org) return res.status(404).json({ message: 'Organization not found.' });
    res.json({
      settings: org.settings,
      backupSchedule: org.backupSchedule,
      enabledModules: org.enabledModules,
      mode: org.mode || 'standalone'
    });
  } catch (error) {
    console.error('Get preferences error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const updatePreferences = async (req, res) => {
  try {
    const { dateFormat, currency, notificationChannels, dashboardLayout, backupSchedule, enabledModules, mode } = req.body;

    const org = await ClientOrg.findById(req.user.organizationId);
    if (!org) return res.status(404).json({ message: 'Organization not found.' });

    if (dateFormat) org.settings.dateFormat = dateFormat;
    if (currency) org.settings.currency = currency;
    if (notificationChannels) {
      org.settings.notificationChannels = {
        ...org.settings.notificationChannels,
        ...notificationChannels
      };
    }
    if (dashboardLayout) org.settings.dashboardLayout = dashboardLayout;
    if (backupSchedule) {
      org.backupSchedule = { ...org.backupSchedule.toObject(), ...backupSchedule };
    }
    if (enabledModules) {
      org.enabledModules = { ...org.enabledModules.toObject(), ...enabledModules };
      org.markModified('enabledModules');
    }
    if (mode && ['standalone', 'erp'].includes(mode)) {
      org.mode = mode;
    }

    await org.save();

    await AuditLog.create({
      organizationId: req.user.organizationId,
      action: 'Preferences updated',
      actionType: 'settings_updated',
      performedBy: req.user._id,
      performedByModel: 'ClientUser',
      description: `Preferences updated${currency ? ` - Currency: ${currency}` : ''}`,
      ipAddress: req.ip,
      severity: 'info'
    });

    res.json({
      settings: org.settings,
      backupSchedule: org.backupSchedule,
      enabledModules: org.enabledModules,
      mode: org.mode || 'standalone'
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export { getPreferences, updatePreferences };