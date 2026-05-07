import Product from '../../models/client/ProductModel.js';
import AuditLog from '../../models/admin/AuditLogModel.js';
import Alert from '../../models/client/AlertModel.js';

const getProducts = async (req, res) => {
  try {
    const tenantId = req.user.organizationId;
    const { page = 1, limit = 20, category, search, lowStock } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = { organizationId: tenantId, isActive: true };
    if (category) query.category = category;
    if (lowStock === 'true') {
      query.$expr = { $lte: ['$stockLevel', '$reorderThreshold'] };
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { barcode: { $regex: search, $options: 'i' } }
      ];
    }

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('supplierId', 'name')
        .sort({ name: 1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Product.countDocuments(query)
    ]);

    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      organizationId: req.user.organizationId
    }).populate('supplierId', 'name email');

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const createProduct = async (req, res) => {
  try {
    const { sku, name, description, category, unit, stockLevel, reorderThreshold, unitCost, sellingPrice, supplierId, location, warehouse, barcode } = req.body;

    if (!sku || !name) {
      return res.status(400).json({ message: 'SKU and name are required.' });
    }

    const existing = await Product.findOne({ organizationId: req.user.organizationId, sku });
    if (existing) {
      return res.status(400).json({ message: 'Product with this SKU already exists.' });
    }

    const product = await Product.create({
      organizationId: req.user.organizationId,
      sku,
      name,
      description: description || '',
      category: category || '',
      unit: unit || 'piece',
      stockLevel: stockLevel || 0,
      reorderThreshold: reorderThreshold || 0,
      unitCost: unitCost || 0,
      sellingPrice: sellingPrice || 0,
      supplierId: supplierId || null,
      location: location || '',
      warehouse: warehouse || '',
      barcode: barcode || ''
    });

    if (product.isLowStock()) {
      await Alert.create({
        organizationId: req.user.organizationId,
        alertType: 'low_stock',
        severity: 'warning',
        title: 'New product below threshold',
        message: `${product.name} was created with stock level (${product.stockLevel}) below reorder threshold (${product.reorderThreshold}).`,
        referenceId: product._id,
        referenceModel: 'Product'
      });
    }

    await AuditLog.create({
      organizationId: req.user.organizationId,
      action: 'Product created',
      actionType: 'product_created',
      performedBy: req.user._id,
      performedByModel: 'ClientUser',
      targetId: product._id,
      targetModel: 'Product',
      description: `Product ${product.name} (${product.sku}) created`,
      ipAddress: req.ip,
      severity: 'info'
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      organizationId: req.user.organizationId
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const { name, description, category, unit, reorderThreshold, unitCost, sellingPrice, supplierId, location, warehouse, barcode } = req.body;

    if (name) product.name = name;
    if (description !== undefined) product.description = description;
    if (category) product.category = category;
    if (unit) product.unit = unit;
    if (reorderThreshold !== undefined) product.reorderThreshold = reorderThreshold;
    if (unitCost !== undefined) product.unitCost = unitCost;
    if (sellingPrice !== undefined) product.sellingPrice = sellingPrice;
    if (supplierId) product.supplierId = supplierId;
    if (location !== undefined) product.location = location;
    if (warehouse !== undefined) product.warehouse = warehouse;
    if (barcode !== undefined) product.barcode = barcode;

    await product.save();

    await AuditLog.create({
      organizationId: req.user.organizationId,
      action: 'Product updated',
      actionType: 'product_updated',
      performedBy: req.user._id,
      performedByModel: 'ClientUser',
      targetId: product._id,
      targetModel: 'Product',
      description: `Product ${product.name} updated`,
      ipAddress: req.ip,
      severity: 'info'
    });

    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const adjustStock = async (req, res) => {
  try {
    const { quantity, type, reason } = req.body;

    if (!quantity || !type) {
      return res.status(400).json({ message: 'Quantity and type (increase/decrease) are required.' });
    }
    if (!['increase', 'decrease'].includes(type)) {
      return res.status(400).json({ message: 'Type must be increase or decrease.' });
    }

    const product = await Product.findOne({
      _id: req.params.id,
      organizationId: req.user.organizationId
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    await product.adjustStock(quantity, type);

    if (product.isLowStock()) {
      const existingAlert = await Alert.findOne({
        organizationId: req.user.organizationId,
        alertType: 'low_stock',
        referenceId: product._id,
        isRead: false
      });
      if (!existingAlert) {
        await Alert.create({
          organizationId: req.user.organizationId,
          alertType: 'low_stock',
          severity: 'warning',
          title: 'Low stock alert',
          message: `${product.name} is below reorder threshold (${product.stockLevel} remaining).`,
          referenceId: product._id,
          referenceModel: 'Product'
        });
      }
    }

    await AuditLog.create({
      organizationId: req.user.organizationId,
      action: 'Stock adjusted',
      actionType: 'product_updated',
      performedBy: req.user._id,
      performedByModel: 'ClientUser',
      targetId: product._id,
      targetModel: 'Product',
      description: `${type}d stock of ${product.name} by ${quantity}. Reason: ${reason || 'N/A'}`,
      ipAddress: req.ip,
      severity: 'info'
    });

    res.json(product);
  } catch (error) {
    console.error('Adjust stock error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, organizationId: req.user.organizationId },
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    await AuditLog.create({
      organizationId: req.user.organizationId,
      action: 'Product deactivated',
      actionType: 'product_deleted',
      performedBy: req.user._id,
      performedByModel: 'ClientUser',
      targetId: product._id,
      targetModel: 'Product',
      description: `Product ${product.name} deactivated`,
      ipAddress: req.ip,
      severity: 'info'
    });

    res.json({ message: 'Product deactivated.' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category', {
      organizationId: req.user.organizationId,
      category: { $ne: '' }
    });
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.find({
      organizationId: req.user.organizationId,
      isActive: true,
      $expr: { $lte: ['$stockLevel', '$reorderThreshold'] }
    }).sort({ stockLevel: 1 });

    res.json(products);
  } catch (error) {
    console.error('Get low stock error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  adjustStock,
  deleteProduct,
  getCategories,
  getLowStockProducts
};