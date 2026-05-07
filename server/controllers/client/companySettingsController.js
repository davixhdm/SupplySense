import ClientOrg from '../../models/admin/ClientOrgModel.js';
import AuditLog from '../../models/admin/AuditLogModel.js';

const getCompanyInfo = async (req, res) => {
  try {
    const org = await ClientOrg.findById(req.user.organizationId).select('organizationName email phone industry address timezone language logo');
    if (!org) {
      return res.status(404).json({ message: 'Organization not found.' });
    }
    res.json(org);
  } catch (error) {
    console.error('Get company info error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const updateCompanyInfo = async (req, res) => {
  try {
    const { organizationName, email, phone, industry, address, timezone, language } = req.body;

    const updateFields = {};
    if (organizationName) updateFields.organizationName = organizationName;
    if (email) updateFields.email = email.toLowerCase();
    if (phone !== undefined) updateFields.phone = phone;
    if (industry) updateFields.industry = industry;
    if (address) updateFields.address = { ...req.organization.address, ...address };
    if (timezone) updateFields.timezone = timezone;
    if (language) updateFields.language = language;

    const org = await ClientOrg.findByIdAndUpdate(req.user.organizationId, updateFields, { new: true });

    await AuditLog.create({
      organizationId: req.user.organizationId,
      action: 'Company info updated',
      actionType: 'settings_updated',
      performedBy: req.user._id,
      performedByModel: 'ClientUser',
      description: 'Company information updated',
      ipAddress: req.ip,
      severity: 'info'
    });

    res.json(org);
  } catch (error) {
    console.error('Update company info error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const uploadLogo = async (req, res) => {
  try {
    const logoUrl = req.file?.path || req.body.logoUrl;
    if (!logoUrl) {
      return res.status(400).json({ message: 'Logo file or URL required.' });
    }

    const org = await ClientOrg.findByIdAndUpdate(
      req.user.organizationId,
      { logo: logoUrl },
      { new: true }
    );

    res.json({ logo: org.logo });
  } catch (error) {
    console.error('Upload logo error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export {
  getCompanyInfo,
  updateCompanyInfo,
  uploadLogo
};