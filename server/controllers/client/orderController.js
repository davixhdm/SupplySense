import Order from '../../models/client/OrderModel.js';
import Product from '../../models/client/ProductModel.js';
import Supplier from '../../models/client/SupplierModel.js';
import Alert from '../../models/client/AlertModel.js';
import AuditLog from '../../models/admin/AuditLogModel.js';
import { predictStockout } from '../../services/aiApiService.js';

const getOrders = async (req, res) => {
  try {
    const tenantId = req.user.organizationId;
    const { page = 1, limit = 20, status, supplierId, productId, search, priority } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = { organizationId: tenantId };
    if (status) query.status = status;
    if (supplierId) query.supplierId = supplierId;
    if (productId) query.productId = productId;
    if (priority) query.priority = priority;
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { trackingNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('productId', 'name sku')
        .populate('supplierId', 'name email phone')
        .populate('createdBy', 'fullName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Order.countDocuments(query)
    ]);

    res.json({
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      organizationId: req.user.organizationId
    })
      .populate('productId', 'name sku stockLevel')
      .populate('supplierId', 'name email phone deliveryTimeline reliabilityScore')
      .populate('createdBy', 'fullName')
      .populate('statusHistory.changedBy', 'fullName');

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }
    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const createOrder = async (req, res) => {
  try {
    const { productId, supplierId, quantity, unitPrice, currency, priority, expectedDeliveryDate, notes } = req.body;

    if (!productId || !supplierId || !quantity || !unitPrice) {
      return res.status(400).json({ message: 'Product, supplier, quantity, and unit price are required.' });
    }

    const product = await Product.findOne({ _id: productId, organizationId: req.user.organizationId });
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const supplier = await Supplier.findOne({ _id: supplierId, organizationId: req.user.organizationId });
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found.' });
    }

    const totalAmount = quantity * unitPrice;

    const order = await Order.create({
      organizationId: req.user.organizationId,
      productId,
      supplierId,
      quantity,
      unitPrice,
      totalAmount,
      currency: currency || 'KSh',
      priority: priority || 'medium',
      expectedDeliveryDate: expectedDeliveryDate || null,
      deliveryNotes: notes || '',
      createdBy: req.user._id,
      status: 'placed'
    });

    const aiPrediction = await predictStockout({
      productId: product._id,
      currentStock: product.stockLevel,
      pendingOrders: quantity,
      historicalSales: []
    }).catch(() => null);

    if (aiPrediction && aiPrediction.riskLevel === 'high') {
      await Alert.create({
        organizationId: req.user.organizationId,
        alertType: 'order_at_risk',
        severity: 'warning',
        title: 'Order may cause stock imbalance',
        message: `Order for ${product.name} may lead to overstock based on demand forecast.`,
        referenceId: order._id,
        referenceModel: 'Order'
      });
    }

    await AuditLog.create({
      organizationId: req.user.organizationId,
      action: 'Order created',
      actionType: 'order_created',
      performedBy: req.user._id,
      performedByModel: 'ClientUser',
      targetId: order._id,
      targetModel: 'Order',
      description: `Order ${order.orderNumber} created for ${product.name}`,
      ipAddress: req.ip,
      severity: 'info'
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required.' });
    }

    const validStatuses = ['placed', 'confirmed', 'shipped', 'in_transit', 'delivered', 'cancelled', 'returned'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }

    const order = await Order.findOne({
      _id: req.params.id,
      organizationId: req.user.organizationId
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    await order.updateStatus(status, req.user._id, notes || '');

    if (status === 'delivered') {
      const product = await Product.findById(order.productId);
      if (product) {
        await product.adjustStock(order.quantity, 'increase');
      }

      const supplier = await Supplier.findById(order.supplierId);
      if (supplier) {
        const onTime = order.expectedDeliveryDate && new Date() <= order.expectedDeliveryDate;
        await supplier.recordDelivery(onTime);
      }
    }

    if (order.isDelayed && order.delayDays > 0) {
      await Alert.create({
        organizationId: req.user.organizationId,
        alertType: 'order_delayed',
        severity: order.delayDays > 7 ? 'critical' : 'warning',
        title: 'Order delayed',
        message: `Order ${order.orderNumber} was delayed by ${order.delayDays} days.`,
        referenceId: order._id,
        referenceModel: 'Order'
      });
    }

    await AuditLog.create({
      organizationId: req.user.organizationId,
      action: 'Order status updated',
      actionType: 'order_updated',
      performedBy: req.user._id,
      performedByModel: 'ClientUser',
      targetId: order._id,
      targetModel: 'Order',
      description: `Order ${order.orderNumber} status changed to ${status}`,
      ipAddress: req.ip,
      changes: { status, notes },
      severity: 'info'
    });

    res.json(order);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { quantity, unitPrice, priority, expectedDeliveryDate, trackingNumber, notes } = req.body;
    const updateFields = {};
    if (quantity) updateFields.quantity = quantity;
    if (unitPrice) updateFields.unitPrice = unitPrice;
    if (quantity && unitPrice) updateFields.totalAmount = quantity * unitPrice;
    if (priority) updateFields.priority = priority;
    if (expectedDeliveryDate) updateFields.expectedDeliveryDate = expectedDeliveryDate;
    if (trackingNumber) updateFields.trackingNumber = trackingNumber;
    if (notes !== undefined) updateFields.deliveryNotes = notes;

    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, organizationId: req.user.organizationId, status: 'placed' },
      updateFields,
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found or cannot be edited.' });
    }

    await AuditLog.create({
      organizationId: req.user.organizationId,
      action: 'Order updated',
      actionType: 'order_updated',
      performedBy: req.user._id,
      performedByModel: 'ClientUser',
      targetId: order._id,
      targetModel: 'Order',
      description: `Order ${order.orderNumber} details updated`,
      ipAddress: req.ip,
      severity: 'info'
    });

    res.json(order);
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const getOrderStats = async (req, res) => {
  try {
    const tenantId = req.user.organizationId;

    const stats = await Order.aggregate([
      { $match: { organizationId: tenantId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalValue: { $sum: '$totalAmount' }
        }
      }
    ]);

    const delayedOrders = await Order.countDocuments({
      organizationId: tenantId,
      isDelayed: true,
      status: { $ne: 'delivered' }
    });

    res.json({ statusBreakdown: stats, delayedOrders });
  } catch (error) {
    console.error('Order stats error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  updateOrder,
  getOrderStats
};