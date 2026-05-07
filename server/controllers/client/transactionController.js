import Transaction from '../../models/client/TransactionModel.js';
import Product from '../../models/client/ProductModel.js';
import Customer from '../../models/client/CustomerModel.js';
import AuditLog from '../../models/admin/AuditLogModel.js';

const getTransactions = async (req, res) => {
  try {
    const tenantId = req.user.organizationId;
    const { page = 1, limit = 20, type, startDate, endDate, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = { organizationId: tenantId };
    if (type) query.type = type;
    if (startDate || endDate) {
      query.transactionDate = {};
      if (startDate) query.transactionDate.$gte = new Date(startDate);
      if (endDate) query.transactionDate.$lte = new Date(endDate);
    }
    if (search) {
      query.$or = [
        { transactionNumber: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const [transactions, total] = await Promise.all([
      Transaction.find(query)
        .populate('productId', 'name sku')
        .populate('customerId', 'fullName')
        .populate('supplierId', 'name')
        .sort({ transactionDate: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Transaction.countDocuments(query)
    ]);

    res.json({
      transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      organizationId: req.user.organizationId
    })
      .populate('productId', 'name sku')
      .populate('customerId', 'fullName')
      .populate('supplierId', 'name')
      .populate('orderId', 'orderNumber');

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found.' });
    }
    res.json(transaction);
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const createTransaction = async (req, res) => {
  try {
    const { type, amount, currency, productId, customerId, supplierId, orderId, quantity, unitPrice, paymentMethod, description, transactionDate } = req.body;

    if (!type || !amount) {
      return res.status(400).json({ message: 'Type and amount are required.' });
    }

    const validTypes = ['sale', 'purchase', 'return', 'refund', 'expense', 'adjustment', 'transfer'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: 'Invalid transaction type.' });
    }

    const transaction = await Transaction.create({
      organizationId: req.user.organizationId,
      type,
      amount,
      currency: currency || req.organization.settings?.currency || 'KSh',
      productId: productId || null,
      customerId: customerId || null,
      supplierId: supplierId || null,
      orderId: orderId || null,
      quantity: quantity || 1,
      unitPrice: unitPrice || amount,
      paymentMethod: paymentMethod || 'other',
      description: description || '',
      transactionDate: transactionDate || new Date(),
      createdBy: req.user._id
    });

    if (productId && (type === 'sale' || type === 'return')) {
      const product = await Product.findOne({ _id: productId, organizationId: req.user.organizationId });
      if (product) {
        const adjustment = type === 'sale' ? 'decrease' : 'increase';
        await product.adjustStock(quantity || 1, adjustment);
      }
    }

    if (customerId && type === 'sale') {
      const customer = await Customer.findOne({ _id: customerId, organizationId: req.user.organizationId });
      if (customer) {
        await customer.recordPurchase(amount);
      }
    }

    await AuditLog.create({
      organizationId: req.user.organizationId,
      action: 'Transaction created',
      actionType: 'transaction_created',
      performedBy: req.user._id,
      performedByModel: 'ClientUser',
      targetId: transaction._id,
      targetModel: 'Transaction',
      description: `${type} transaction of ${amount} created`,
      ipAddress: req.ip,
      severity: 'info'
    });

    res.status(201).json(transaction);
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const { status, description } = req.body;
    const updateFields = {};
    if (status) updateFields.status = status;
    if (description !== undefined) updateFields.description = description;

    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, organizationId: req.user.organizationId },
      updateFields,
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found.' });
    }

    await AuditLog.create({
      organizationId: req.user.organizationId,
      action: 'Transaction updated',
      actionType: 'admin_action',
      performedBy: req.user._id,
      performedByModel: 'ClientUser',
      targetId: transaction._id,
      targetModel: 'Transaction',
      description: `Transaction ${transaction.transactionNumber} updated`,
      ipAddress: req.ip,
      severity: 'info'
    });

    res.json(transaction);
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const getTransactionSummary = async (req, res) => {
  try {
    const tenantId = req.user.organizationId;
    const { period = 'monthly' } = req.query;

    let groupFormat;
    if (period === 'daily') groupFormat = '%Y-%m-%d';
    else if (period === 'weekly') groupFormat = '%Y-%U';
    else groupFormat = '%Y-%m';

    const summary = await Transaction.aggregate([
      { $match: { organizationId: tenantId, status: 'completed' } },
      {
        $group: {
          _id: {
            type: '$type',
            period: { $dateToString: { format: groupFormat, date: '$transactionDate' } }
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.period': -1 } }
    ]);

    res.json(summary);
  } catch (error) {
    console.error('Transaction summary error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  getTransactionSummary
};