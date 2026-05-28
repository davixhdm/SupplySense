import PendingActivation from '../../models/admin/PendingActivationModel.js';
import ClientOrg from '../../models/admin/ClientOrgModel.js';
import Payment from '../../models/admin/PaymentModel.js';
import AuditLog from '../../models/admin/AuditLogModel.js';
import { generateLicenseKey, sendLicenseToClient } from '../../services/licenseService.js';

const getPendingActivations = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = {};
    query.status = status || 'pending';
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [activations, total] = await Promise.all([
      PendingActivation.find(query).populate('organizationId', 'organizationName email').sort({ submittedAt: -1 }).skip(skip).limit(parseInt(limit)),
      PendingActivation.countDocuments(query)
    ]);

    res.json({ activations, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) } });
  } catch (error) {
    console.error('Get pending activations error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const approveActivation = async (req, res) => {
  try {
    const activation = await PendingActivation.findById(req.params.id);
    if (!activation || activation.status !== 'pending') {
      return res.status(400).json({ message: 'Activation not found or already processed.' });
    }

    if (activation.isExpired()) {
      await activation.markExpired();
      return res.status(400).json({ message: 'Activation request expired.' });
    }

    const org = await ClientOrg.findById(activation.organizationId);
    if (!org) return res.status(404).json({ message: 'Organization not found.' });

    const license = await generateLicenseKey(org._id, activation.plan, activation.billingCycle, activation.paymentId, 'payment');
    
    org.licenseKey = license.key;
    org.plan = activation.plan;
    org.billingCycle = activation.billingCycle;
    org.planStartDate = new Date();
    org.trialEndDate = null;
    org.isActive = true;
    await org.save();

    activation.licenseKeyGenerated = license.key;
    await activation.approve(req.admin._id);

    await Payment.create({
      organizationId: org._id,
      pendingActivationId: activation._id,
      amount: activation.amount,
      currency: activation.currency,
      plan: activation.plan,
      billingCycle: activation.billingCycle,
      paymentMethod: activation.paymentMethod,
      paymentProviderRef: activation.paymentDetails?.transactionCode || activation.paymentDetails?.mpesaReceiptNumber || '',
      status: 'completed',
      paymentConfirmedAt: new Date()
    });

    await sendLicenseToClient(license, org);

    await AuditLog.create({
      action: 'Activation approved',
      actionType: 'payment_approved',
      performedBy: req.admin._id,
      performedByModel: 'AdminUser',
      targetId: activation._id,
      targetModel: 'PendingActivation',
      description: `Payment approved for ${org.organizationName}, license issued`,
      severity: 'info'
    });

    res.json({ message: 'Approved. License sent.', licenseKey: license.key });
  } catch (error) {
    console.error('Approve activation error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const rejectActivation = async (req, res) => {
  try {
    const { reason } = req.body;
    const activation = await PendingActivation.findById(req.params.id);
    if (!activation || activation.status !== 'pending') {
      return res.status(400).json({ message: 'Activation not found or already processed.' });
    }

    await activation.reject(req.admin._id, reason || 'Rejected by admin');

    await Payment.create({
      organizationId: activation.organizationId,
      pendingActivationId: activation._id,
      amount: activation.amount,
      currency: activation.currency,
      plan: activation.plan,
      billingCycle: activation.billingCycle,
      paymentMethod: activation.paymentMethod,
      status: 'rejected',
      paymentConfirmedAt: new Date()
    });

    await AuditLog.create({
      action: 'Activation rejected',
      actionType: 'payment_rejected',
      performedBy: req.admin._id,
      performedByModel: 'AdminUser',
      targetId: activation._id,
      targetModel: 'PendingActivation',
      description: `Payment rejected. Reason: ${reason || 'N/A'}`,
      severity: 'warning'
    });

    res.json({ message: 'Payment rejected.' });
  } catch (error) {
    console.error('Reject activation error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export { getPendingActivations, approveActivation, rejectActivation };