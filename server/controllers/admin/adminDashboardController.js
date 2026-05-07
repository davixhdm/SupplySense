import ClientOrg from '../../models/admin/ClientOrgModel.js';
import LicenseKey from '../../models/admin/LicenseKeyModel.js';
import PendingActivation from '../../models/admin/PendingActivationModel.js';
import Payment from '../../models/admin/PaymentModel.js';

const getStats = async (req, res) => {
  try {
    const [
      totalOrgs,
      activeLicenses,
      trialOrgs,
      pendingApprovals,
      totalRevenue,
      recentOrgs
    ] = await Promise.all([
      ClientOrg.countDocuments(),
      LicenseKey.countDocuments({ status: 'active' }),
      ClientOrg.countDocuments({ plan: 'trial' }),
      PendingActivation.countDocuments({ status: 'pending' }),
      Payment.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      ClientOrg.find().sort({ createdAt: -1 }).limit(5).select('organizationName plan createdAt')
    ]);

    res.json({
      totalOrgs,
      activeLicenses,
      trialOrgs,
      pendingApprovals,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentOrgs
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export { getStats };