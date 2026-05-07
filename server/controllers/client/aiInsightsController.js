import { generateInsights, predictStockout, predictDemand, detectAnomalies, scoreSupplier, predictCustomerChurn, getRecommendations } from '../../services/aiApiService.js';
import Product from '../../models/client/ProductModel.js';
import Order from '../../models/client/OrderModel.js';
import Supplier from '../../models/client/SupplierModel.js';
import Customer from '../../models/client/CustomerModel.js';
import Transaction from '../../models/client/TransactionModel.js';
import Employee from '../../models/client/EmployeeModel.js';

const getGeneralInsights = async (req, res) => {
  try {
    const tenantId = req.user.organizationId;

    const [productCount, lowStock, pendingOrders, topSuppliers, atRiskCustomers, recentTransactions] = await Promise.all([
      Product.countDocuments({ organizationId: tenantId, isActive: true }),
      Product.countDocuments({ organizationId: tenantId, isActive: true, $expr: { $lte: ['$stockLevel', '$reorderThreshold'] } }),
      Order.countDocuments({ organizationId: tenantId, status: { $in: ['placed', 'confirmed', 'shipped', 'in_transit'] } }),
      Supplier.find({ organizationId: tenantId, isActive: true }).sort({ reliabilityScore: -1 }).limit(5).select('name reliabilityScore'),
      Customer.find({ organizationId: tenantId, isActive: true, churnRisk: { $gte: 50 } }).sort({ churnRisk: -1 }).limit(10).select('fullName churnRisk lastPurchaseDate'),
      Transaction.find({ organizationId: tenantId, status: 'completed' }).sort({ transactionDate: -1 }).limit(20).select('amount type transactionDate')
    ]);

    const overview = {
      inventoryHealth: {
        totalProducts: productCount,
        lowStockItems: lowStock,
        healthPercent: productCount ? Math.round(((productCount - lowStock) / productCount) * 100) : 100
      },
      orderSummary: {
        pendingOrders,
        status: 'operational'
      },
      supplierOverview: {
        topSuppliers,
        avgReliability: topSuppliers.length ? topSuppliers.reduce((a, b) => a + b.reliabilityScore, 0) / topSuppliers.length : 0
      },
      customerInsights: {
        atRiskCount: atRiskCustomers.length,
        atRiskCustomers
      },
      recentTransactions
    };

    let aiInsights = null;
    try {
      aiInsights = await generateInsights({
        organizationId: tenantId,
        overview
      });
    } catch (aiError) {
      console.warn('AI insights unavailable:', aiError.message);
    }

    res.json({
      overview,
      aiInsights: aiInsights?.insights || 'AI insights will be available once enough data is collected.'
    });
  } catch (error) {
    console.error('General insights error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const searchInsights = async (req, res) => {
  try {
    const tenantId = req.user.organizationId;
    const { query, category } = req.query;

    if (!query && !category) {
      return res.status(400).json({ message: 'Query or category is required.' });
    }

    let data = {};
    let aiResult = null;

    if (category === 'inventory' || query?.toLowerCase().includes('inventory') || query?.toLowerCase().includes('stock')) {
      const products = await Product.find({ organizationId: tenantId, isActive: true }).select('name stockLevel reorderThreshold unitCost sellingPrice');
      data = { products, category: 'inventory' };
      try {
        aiResult = await generateInsights({ organizationId: tenantId, category: 'inventory', data: products, query });
      } catch (e) { /* ignore */ }
    } else if (category === 'suppliers' || query?.toLowerCase().includes('supplier')) {
      const suppliers = await Supplier.find({ organizationId: tenantId, isActive: true }).select('name reliabilityScore onTimeDeliveries totalOrders');
      data = { suppliers, category: 'suppliers' };
      try {
        aiResult = await scoreSupplier({ organizationId: tenantId, suppliers });
      } catch (e) { /* ignore */ }
    } else if (category === 'customers' || query?.toLowerCase().includes('customer')) {
      const customers = await Customer.find({ organizationId: tenantId, isActive: true }).select('fullName churnRisk totalSpent purchaseCount lastPurchaseDate');
      data = { customers, category: 'customers' };
      try {
        aiResult = await predictCustomerChurn({ organizationId: tenantId, customers });
      } catch (e) { /* ignore */ }
    } else if (category === 'orders' || query?.toLowerCase().includes('order')) {
      const orders = await Order.find({ organizationId: tenantId }).select('orderNumber status isDelayed delayDays totalAmount');
      data = { orders, category: 'orders' };
      try {
        aiResult = await generateInsights({ organizationId: tenantId, category: 'orders', data: orders, query });
      } catch (e) { /* ignore */ }
    } else if (category === 'transactions' || query?.toLowerCase().includes('transaction')) {
      const transactions = await Transaction.find({ organizationId: tenantId, status: 'completed' }).sort({ transactionDate: -1 }).limit(100);
      data = { transactions, category: 'transactions' };
      try {
        aiResult = await detectAnomalies({ organizationId: tenantId, transactions });
      } catch (e) { /* ignore */ }
    } else if (category === 'employees' || query?.toLowerCase().includes('employee')) {
      const employees = await Employee.find({ organizationId: tenantId, isActive: true }).select('fullName department performanceScore efficiency');
      data = { employees, category: 'employees' };
      try {
        aiResult = await generateInsights({ organizationId: tenantId, category: 'employees', data: employees, query });
      } catch (e) { /* ignore */ }
    } else {
      try {
        aiResult = await getRecommendations({ organizationId: tenantId, query });
      } catch (e) { /* ignore */ }
    }

    res.json({
      query: query || category,
      data,
      insights: aiResult?.insights || aiResult?.recommendations || 'No specific insights available for this query.'
    });
  } catch (error) {
    console.error('Search insights error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const getPrediction = async (req, res) => {
  try {
    const { type, referenceId } = req.query;

    if (!type) {
      return res.status(400).json({ message: 'Prediction type is required.' });
    }

    const tenantId = req.user.organizationId;
    let result = null;

    if (type === 'stockout' && referenceId) {
      const product = await Product.findOne({ _id: referenceId, organizationId: tenantId });
      if (!product) return res.status(404).json({ message: 'Product not found.' });
      result = await predictStockout({ productId: product._id, currentStock: product.stockLevel, reorderThreshold: product.reorderThreshold });
    } else if (type === 'demand') {
      const products = await Product.find({ organizationId: tenantId, isActive: true }).select('name stockLevel');
      result = await predictDemand({ organizationId: tenantId, products });
    } else if (type === 'supplier_risk') {
      const suppliers = await Supplier.find({ organizationId: tenantId, isActive: true }).select('name totalOrders onTimeDeliveries lateDeliveries');
      result = await scoreSupplier({ organizationId: tenantId, suppliers });
    } else if (type === 'customer_churn') {
      const customers = await Customer.find({ organizationId: tenantId, isActive: true }).select('fullName lastPurchaseDate purchaseCount totalSpent');
      result = await predictCustomerChurn({ organizationId: tenantId, customers });
    } else if (type === 'transaction_anomaly') {
      const transactions = await Transaction.find({ organizationId: tenantId, status: 'completed' }).sort({ transactionDate: -1 }).limit(500);
      result = await detectAnomalies({ organizationId: tenantId, transactions });
    } else {
      return res.status(400).json({ message: 'Invalid prediction type.' });
    }

    res.json(result);
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ message: 'AI prediction service unavailable.' });
  }
};

export {
  getGeneralInsights,
  searchInsights,
  getPrediction
};