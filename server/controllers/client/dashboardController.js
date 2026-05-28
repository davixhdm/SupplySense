import Product from '../../models/client/ProductModel.js';
import Order from '../../models/client/OrderModel.js';
import Supplier from '../../models/client/SupplierModel.js';
import Alert from '../../models/client/AlertModel.js';
import Customer from '../../models/client/CustomerModel.js';
import Transaction from '../../models/client/TransactionModel.js';
import { getRecommendations } from '../../services/aiApiService.js';

const getDashboardStats = async (req, res) => {
  try {
    const tenantId = req.user.organizationId;

    const [
      totalProducts,
      activeOrders,
      totalSuppliers,
      unreadAlerts,
      totalCustomers,
      lowStockProducts,
      recentOrders,
      recentAlerts,
      monthlyTransactions,
      stockValue
    ] = await Promise.all([
      Product.countDocuments({ organizationId: tenantId, isActive: true }),
      Order.countDocuments({ organizationId: tenantId, status: { $in: ['placed', 'confirmed', 'shipped', 'in_transit'] } }),
      Supplier.countDocuments({ organizationId: tenantId, isActive: true }),
      Alert.countDocuments({ organizationId: tenantId, isRead: false }),
      Customer.countDocuments({ organizationId: tenantId, isActive: true }),
      Product.countDocuments({ organizationId: tenantId, isActive: true, $expr: { $lte: ['$stockLevel', '$reorderThreshold'] } }),
      Order.find({ organizationId: tenantId }).sort({ createdAt: -1 }).limit(5).populate('productId', 'name').populate('supplierId', 'name'),
      Alert.find({ organizationId: tenantId, isRead: false }).sort({ createdAt: -1 }).limit(10),
      Transaction.aggregate([
        { $match: { organizationId: tenantId, status: 'completed' } },
        { $group: { _id: { $month: '$transactionDate' }, total: { $sum: '$amount' }, count: { $sum: 1 } } },
        { $sort: { '_id': 1 } }
      ]),
      Product.aggregate([
        { $match: { organizationId: tenantId, isActive: true } },
        { $group: { _id: null, totalValue: { $sum: { $multiply: ['$stockLevel', '$unitCost'] } } } }
      ])
    ]);

    const stockHealth = totalProducts > 0
      ? Math.round(((totalProducts - lowStockProducts) / totalProducts) * 100)
      : 100;

    res.json({
      stats: {
        totalProducts,
        activeOrders,
        totalSuppliers,
        unreadAlerts,
        totalCustomers,
        lowStockProducts,
        stockHealth,
        stockValue: stockValue[0]?.totalValue || 0
      },
      recentOrders,
      recentAlerts,
      monthlyTransactions
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const getCharts = async (req, res) => {
  try {
    const tenantId = req.user.organizationId;

    const [
      orderStatusData,
      inventoryTrend,
      monthlyRevenue,
      supplierPerformance
    ] = await Promise.all([
      Order.aggregate([
        { $match: { organizationId: tenantId } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Transaction.aggregate([
        { $match: { organizationId: tenantId, type: { $in: ['sale', 'purchase'] } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$transactionDate' } }, totalAmount: { $sum: '$amount' } } },
        { $sort: { '_id': -1 } },
        { $limit: 30 }
      ]),
      Transaction.aggregate([
        { $match: { organizationId: tenantId, type: 'sale', status: 'completed' } },
        { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$transactionDate' } }, revenue: { $sum: '$amount' } } },
        { $sort: { '_id': 1 } },
        { $limit: 12 }
      ]),
      Supplier.aggregate([
        { $match: { organizationId: tenantId, isActive: true } },
        { $project: { name: 1, reliabilityScore: 1, onTimeDeliveries: 1, totalOrders: 1 } },
        { $sort: { reliabilityScore: -1 } }
      ])
    ]);

    res.json({
      orderStatusData,
      inventoryTrend,
      monthlyRevenue,
      supplierPerformance
    });
  } catch (error) {
    console.error('Charts error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export { getDashboardStats, getCharts };