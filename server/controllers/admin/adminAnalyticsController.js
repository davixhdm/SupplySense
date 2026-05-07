import ClientOrg from '../../models/admin/ClientOrgModel.js';
import Payment from '../../models/admin/PaymentModel.js';
import LicenseKey from '../../models/admin/LicenseKeyModel.js';

const getPlatformAnalytics = async (req, res) => {
  try {
    const totalOrgs = await ClientOrg.countDocuments();
    const trialOrgs = await ClientOrg.countDocuments({ plan: 'trial' });
    const activeOrgs = await ClientOrg.countDocuments({ isActive: true, isSuspended: false });
    const suspendedOrgs = await ClientOrg.countDocuments({ isSuspended: true });
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const planDistribution = await ClientOrg.aggregate([
      { $group: { _id: '$plan', count: { $sum: 1 } } }
    ]);
    const recentPayments = await Payment.find({ status: 'completed' }).sort({ createdAt: -1 }).limit(10).populate('organizationId', 'organizationName');

    res.json({
      totalOrgs,
      trialOrgs,
      activeOrgs,
      suspendedOrgs,
      totalRevenue: totalRevenue[0]?.total || 0,
      planDistribution,
      recentPayments
    });
  } catch (error) {
    console.error('Admin analytics error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export { getPlatformAnalytics };