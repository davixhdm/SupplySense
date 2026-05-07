import LicenseKey from '../../models/admin/LicenseKeyModel.js';
import { generateLicenseKey, revokeLicense, sendLicenseToClient } from '../../services/licenseService.js';
import ClientOrg from '../../models/admin/ClientOrgModel.js';
import AuditLog from '../../models/admin/AuditLogModel.js';

const getLicenses = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = {};
    if (status) query.status = status;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [licenses, total] = await Promise.all([
      LicenseKey.find(query).populate('organizationId', 'organizationName').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      LicenseKey.countDocuments(query)
    ]);

    res.json({ licenses, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) } });
  } catch (error) {
    console.error('Get licenses error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const generateLicense = async (req, res) => {
  try {
    const { organizationId, plan, billingCycle } = req.body;
    if (!organizationId || !plan || !billingCycle) {
      return res.status(400).json({ message: 'Organization, plan, and billing cycle required.' });
    }

    const license = await generateLicenseKey(organizationId, plan, billingCycle, null, 'admin');
    const org = await ClientOrg.findById(organizationId);
    if (org) {
      org.licenseKey = license.key;
      org.plan = plan;
      org.billingCycle = billingCycle;
      org.planStartDate = new Date();
      org.trialEndDate = null;
      await org.save();
      await sendLicenseToClient(license, org);
    }

    await AuditLog.create({
      action: 'License generated',
      actionType: 'license_generated',
      performedBy: req.admin._id,
      performedByModel: 'AdminUser',
      targetId: license._id,
      targetModel: 'LicenseKey',
      description: `License ${license.key} generated for ${org?.organizationName}`,
      severity: 'info'
    });

    res.status(201).json(license);
  } catch (error) {
    console.error('Generate license error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const revokeLicenseHandler = async (req, res) => {
  try {
    const { reason } = req.body;
    const license = await LicenseKey.findById(req.params.id);
    if (!license) return res.status(404).json({ message: 'License not found.' });

    await revokeLicense(license._id, req.admin._id, reason || 'Admin revoked');
    res.json({ message: 'License revoked.' });
  } catch (error) {
    console.error('Revoke license error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export { getLicenses, generateLicense, revokeLicenseHandler };