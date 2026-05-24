import { generateInsights } from '../../services/aiApiService.js';
import Product from '../../models/client/ProductModel.js';
import Order from '../../models/client/OrderModel.js';
import Supplier from '../../models/client/SupplierModel.js';
import Customer from '../../models/client/CustomerModel.js';
import Transaction from '../../models/client/TransactionModel.js';
import Employee from '../../models/client/EmployeeModel.js';

const getGeneralInsights = async (req, res) => {
  try {
    const tenantId = req.user.organizationId;

    const [products, suppliers, customers, orders, transactions, employees] = await Promise.all([
      Product.find({ organizationId: tenantId, isActive: true }).select('name stockLevel reorderThreshold unitCost sellingPrice').lean(),
      Supplier.find({ organizationId: tenantId, isActive: true }).select('name reliabilityScore onTimeDeliveries totalOrders').lean(),
      Customer.find({ organizationId: tenantId, isActive: true }).select('fullName churnRisk totalSpent purchaseCount lastPurchaseDate').lean(),
      Order.find({ organizationId: tenantId }).select('orderNumber status isDelayed delayDays totalAmount').lean(),
      Transaction.find({ organizationId: tenantId, status: 'completed' }).sort({ transactionDate: -1 }).limit(100).select('amount type transactionDate isAnomaly').lean(),
      Employee.find({ organizationId: tenantId, isActive: true }).select('fullName department performanceScore efficiency').lean()
    ]);

    const data = { products, suppliers, customers, orders, transactions, employees };

    let aiResult = null;
    try {
      aiResult = await generateInsights({
        organizationId: tenantId,
        query: 'general',
        category: 'general',
        data
      });
    } catch (e) {
      console.warn('AI insights unavailable:', e.message);
    }

    const productCount = products.length;
    const lowStock = products.filter(p => p.stockLevel <= p.reorderThreshold).length;
    const atRiskCustomers = customers.filter(c => c.churnRisk >= 50);
    const topSuppliers = suppliers.sort((a, b) => b.reliabilityScore - a.reliabilityScore).slice(0, 5);
    const recentTransactions = transactions.slice(0, 20);
    const pendingOrders = orders.filter(o => ['placed', 'confirmed', 'shipped', 'in_transit'].includes(o.status)).length;

    res.json({
      overview: {
        inventoryHealth: { totalProducts: productCount, lowStockItems: lowStock, healthPercent: productCount ? Math.round(((productCount - lowStock) / productCount) * 100) : 100 },
        orderSummary: { pendingOrders, status: 'operational' },
        supplierOverview: { topSuppliers, avgReliability: topSuppliers.length ? topSuppliers.reduce((a, b) => a + b.reliabilityScore, 0) / topSuppliers.length : 0 },
        customerInsights: { atRiskCount: atRiskCustomers.length, atRiskCustomers },
        recentTransactions
      },
      aiInsights: aiResult?.insights || 'AI insights will be available once enough data is collected.',
      charts: aiResult?.charts || {},
      recommendations: aiResult?.recommendations || []
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

    const [products, suppliers, customers, orders, transactions, employees] = await Promise.all([
      Product.find({ organizationId: tenantId, isActive: true }).select('name stockLevel reorderThreshold unitCost sellingPrice').lean(),
      Supplier.find({ organizationId: tenantId, isActive: true }).select('name reliabilityScore onTimeDeliveries totalOrders').lean(),
      Customer.find({ organizationId: tenantId, isActive: true }).select('fullName churnRisk totalSpent purchaseCount lastPurchaseDate').lean(),
      Order.find({ organizationId: tenantId }).select('orderNumber status isDelayed delayDays totalAmount createdAt').lean(),
      Transaction.find({ organizationId: tenantId, status: 'completed' }).sort({ transactionDate: -1 }).limit(200).select('amount type transactionDate isAnomaly').lean(),
      Employee.find({ organizationId: tenantId, isActive: true }).select('fullName department performanceScore efficiency').lean()
    ]);

    const data = { products, suppliers, customers, orders, transactions, employees };

    let aiResult = null;
    try {
      aiResult = await generateInsights({
        organizationId: tenantId,
        query: query || category,
        category: category || '',
        data
      });
    } catch (e) {
      console.warn('AI insights unavailable:', e.message);
    }

    res.json({
      query: query || category,
      insights: aiResult?.insights || 'Unable to generate insights at this time.',
      charts: aiResult?.charts || {},
      recommendations: aiResult?.recommendations || [],
      data
    });
  } catch (error) {
    console.error('Search insights error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const getPrediction = async (req, res) => {
  try {
    const { type, referenceId } = req.query;
    if (!type) return res.status(400).json({ message: 'Prediction type is required.' });

    const tenantId = req.user.organizationId;
    const { predictStockout, predictDemand, detectAnomalies, scoreSupplier, predictCustomerChurn } = await import('../../services/aiApiService.js');

    let result = null;
    if (type === 'stockout' && referenceId) {
      const product = await Product.findOne({ _id: referenceId, organizationId: tenantId });
      if (!product) return res.status(404).json({ message: 'Product not found.' });
      result = await predictStockout({ productId: product._id, currentStock: product.stockLevel, reorderThreshold: product.reorderThreshold });
    } else if (type === 'demand') {
      const products = await Product.find({ organizationId: tenantId, isActive: true }).select('name stockLevel').lean();
      result = await predictDemand({ organizationId: tenantId, products });
    } else if (type === 'supplier_risk') {
      const suppliers = await Supplier.find({ organizationId: tenantId, isActive: true }).select('name totalOrders onTimeDeliveries lateDeliveries').lean();
      result = await scoreSupplier({ organizationId: tenantId, suppliers });
    } else if (type === 'customer_churn') {
      const customers = await Customer.find({ organizationId: tenantId, isActive: true }).select('fullName lastPurchaseDate purchaseCount totalSpent').lean();
      result = await predictCustomerChurn({ organizationId: tenantId, customers });
    } else if (type === 'transaction_anomaly') {
      const transactions = await Transaction.find({ organizationId: tenantId, status: 'completed' }).sort({ transactionDate: -1 }).limit(500).lean();
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

export { getGeneralInsights, searchInsights, getPrediction };