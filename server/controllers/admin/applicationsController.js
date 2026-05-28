import ClientOrg from '../../models/admin/ClientOrgModel.js';
import ClientUser from '../../models/client/ClientUserModel.js';
import Product from '../../models/client/ProductModel.js';
import Supplier from '../../models/client/SupplierModel.js';
import Order from '../../models/client/OrderModel.js';
import Customer from '../../models/client/CustomerModel.js';
import Transaction from '../../models/client/TransactionModel.js';
import Employee from '../../models/client/EmployeeModel.js';
import Alert from '../../models/client/AlertModel.js';
import Device from '../../models/client/DeviceModel.js';
import LicenseKey from '../../models/admin/LicenseKeyModel.js';
import PendingActivation from '../../models/admin/PendingActivationModel.js';
import Payment from '../../models/admin/PaymentModel.js';
import AuditLog from '../../models/admin/AuditLogModel.js';
import { generateLicenseKey, revokeLicense } from '../../services/licenseService.js';

const getApplications = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, plan, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const query = {};
    if (plan) query.plan = plan;
    if (status === 'active') query.isActive = true;
    else if (status === 'suspended') query.isSuspended = true;
    if (search) {
      query.$or = [
        { organizationName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const [applications, total] = await Promise.all([
      ClientOrg.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .select('-erpConnections.apiKey'),
      ClientOrg.countDocuments(query)
    ]);

    res.json({
      applications,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const getApplicationById = async (req, res) => {
  try {
    const org = await ClientOrg.findById(req.params.id).select('-erpConnections.apiKey');
    if (!org) return res.status(404).json({ message: 'Organization not found.' });
    res.json(org);
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const updatePlan = async (req, res) => {
  try {
    const { plan, billingCycle, maxUsers } = req.body;
    const updateFields = {};
    if (plan) updateFields.plan = plan;
    if (billingCycle) updateFields.billingCycle = billingCycle;
    if (maxUsers !== undefined) updateFields.maxUsers = maxUsers;

    const org = await ClientOrg.findByIdAndUpdate(req.params.id, updateFields, { new: true });
    if (!org) return res.status(404).json({ message: 'Organization not found.' });

    await AuditLog.create({
      action: 'Plan updated',
      actionType: 'plan_changed',
      performedBy: req.admin._id,
      performedByModel: 'AdminUser',
      targetId: org._id,
      targetModel: 'ClientOrg',
      description: `Plan for ${org.organizationName} updated to ${plan || org.plan}`,
      severity: 'info'
    });

    res.json(org);
  } catch (error) {
    console.error('Update plan error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const suspendOrganization = async (req, res) => {
  try {
    const org = await ClientOrg.findByIdAndUpdate(req.params.id,
      { isSuspended: true, suspendedAt: new Date(), suspendedReason: req.body.reason || '' },
      { new: true }
    );
    if (!org) return res.status(404).json({ message: 'Organization not found.' });

    await AuditLog.create({
      action: 'Organization suspended',
      actionType: 'admin_action',
      performedBy: req.admin._id,
      performedByModel: 'AdminUser',
      targetId: org._id,
      description: `${org.organizationName} suspended. Reason: ${req.body.reason || 'N/A'}`,
      severity: 'warning'
    });
    res.json(org);
  } catch (error) {
    console.error('Suspend org error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const reactivateOrganization = async (req, res) => {
  try {
    const org = await ClientOrg.findByIdAndUpdate(req.params.id,
      { isSuspended: false, isActive: true, suspendedReason: '' },
      { new: true }
    );
    if (!org) return res.status(404).json({ message: 'Organization not found.' });

    await AuditLog.create({
      action: 'Organization reactivated',
      actionType: 'admin_action',
      performedBy: req.admin._id,
      performedByModel: 'AdminUser',
      targetId: org._id,
      description: `${org.organizationName} reactivated`,
      severity: 'info'
    });
    res.json(org);
  } catch (error) {
    console.error('Reactivate org error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const extendTrial = async (req, res) => {
  try {
    const { days } = req.body;
    if (!days || days < 1) return res.status(400).json({ message: 'Days required.' });

    const org = await ClientOrg.findById(req.params.id);
    if (!org) return res.status(404).json({ message: 'Organization not found.' });

    org.trialEndDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    await org.save();

    res.json(org);
  } catch (error) {
    console.error('Extend trial error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
const deleteOrganization = async (req, res) => {
  try {
    const org = await ClientOrg.findById(req.params.id);
    if (!org) return res.status(404).json({ message: 'Organization not found.' });

    const tenantId = org._id;

    await Promise.all([
      ClientUser.deleteMany({ organizationId: tenantId }),
      Product.deleteMany({ organizationId: tenantId }),
      Supplier.deleteMany({ organizationId: tenantId }),
      Order.deleteMany({ organizationId: tenantId }),
      Customer.deleteMany({ organizationId: tenantId }),
      Transaction.deleteMany({ organizationId: tenantId }),
      Employee.deleteMany({ organizationId: tenantId }),
      Alert.deleteMany({ organizationId: tenantId }),
      Device.deleteMany({ organizationId: tenantId }),
      LicenseKey.deleteMany({ organizationId: tenantId }),
      PendingActivation.deleteMany({ organizationId: tenantId }),
      Payment.deleteMany({ organizationId: tenantId }),
      AuditLog.deleteMany({ organizationId: tenantId })
    ]);

    await ClientOrg.findByIdAndDelete(tenantId);

    await AuditLog.create({
      action: 'Organization deleted',
      actionType: 'admin_action',
      performedBy: req.admin._id,
      performedByModel: 'AdminUser',
      targetId: tenantId,
      description: `Deleted organization: ${org.organizationName} and all associated data`,
      severity: 'critical'
    });

    res.json({ message: 'Organization and all data permanently deleted.' });
  } catch (error) {
    console.error('Delete organization error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export { getApplications, getApplicationById, updatePlan, suspendOrganization, reactivateOrganization, extendTrial, deleteOrganization };