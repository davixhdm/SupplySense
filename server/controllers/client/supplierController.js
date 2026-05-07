import Supplier from '../../models/client/SupplierModel.js';
import AuditLog from '../../models/admin/AuditLogModel.js';

const getSuppliers = async (req, res) => {
  try {
    const tenantId = req.user.organizationId;
    const { page = 1, limit = 20, search, isPreferred } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = { organizationId: tenantId, isActive: true };
    if (isPreferred === 'true') query.isPreferred = true;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const [suppliers, total] = await Promise.all([
      Supplier.find(query)
        .sort({ name: 1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Supplier.countDocuments(query)
    ]);

    res.json({
      suppliers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get suppliers error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findOne({
      _id: req.params.id,
      organizationId: req.user.organizationId
    });

    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found.' });
    }
    res.json(supplier);
  } catch (error) {
    console.error('Get supplier error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const createSupplier = async (req, res) => {
  try {
    const { name, email, phone, contactPerson, address, deliveryTimeline, deliveryTimelineUnit, paymentTerms, notes } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required.' });
    }

    const existing = await Supplier.findOne({ organizationId: req.user.organizationId, email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'Supplier with this email already exists.' });
    }

    const supplier = await Supplier.create({
      organizationId: req.user.organizationId,
      name,
      email: email.toLowerCase(),
      phone: phone || '',
      contactPerson: contactPerson || '',
      address: address || {},
      deliveryTimeline: deliveryTimeline || 0,
      deliveryTimelineUnit: deliveryTimelineUnit || 'days',
      paymentTerms: paymentTerms || '',
      notes: notes || ''
    });

    await AuditLog.create({
      organizationId: req.user.organizationId,
      action: 'Supplier created',
      actionType: 'supplier_created',
      performedBy: req.user._id,
      performedByModel: 'ClientUser',
      targetId: supplier._id,
      targetModel: 'Supplier',
      description: `Supplier ${supplier.name} created`,
      ipAddress: req.ip,
      severity: 'info'
    });

    res.status(201).json(supplier);
  } catch (error) {
    console.error('Create supplier error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findOne({
      _id: req.params.id,
      organizationId: req.user.organizationId
    });

    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found.' });
    }

    const { name, email, phone, contactPerson, address, deliveryTimeline, deliveryTimelineUnit, paymentTerms, isPreferred, notes } = req.body;

    if (name) supplier.name = name;
    if (email) supplier.email = email.toLowerCase();
    if (phone !== undefined) supplier.phone = phone;
    if (contactPerson !== undefined) supplier.contactPerson = contactPerson;
    if (address) supplier.address = { ...supplier.address, ...address };
    if (deliveryTimeline !== undefined) supplier.deliveryTimeline = deliveryTimeline;
    if (deliveryTimelineUnit) supplier.deliveryTimelineUnit = deliveryTimelineUnit;
    if (paymentTerms !== undefined) supplier.paymentTerms = paymentTerms;
    if (isPreferred !== undefined) supplier.isPreferred = isPreferred;
    if (notes !== undefined) supplier.notes = notes;

    await supplier.save();

    await AuditLog.create({
      organizationId: req.user.organizationId,
      action: 'Supplier updated',
      actionType: 'supplier_updated',
      performedBy: req.user._id,
      performedByModel: 'ClientUser',
      targetId: supplier._id,
      targetModel: 'Supplier',
      description: `Supplier ${supplier.name} updated`,
      ipAddress: req.ip,
      severity: 'info'
    });

    res.json(supplier);
  } catch (error) {
    console.error('Update supplier error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findOneAndUpdate(
      { _id: req.params.id, organizationId: req.user.organizationId },
      { isActive: false },
      { new: true }
    );

    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found.' });
    }

    await AuditLog.create({
      organizationId: req.user.organizationId,
      action: 'Supplier deactivated',
      actionType: 'supplier_deleted',
      performedBy: req.user._id,
      performedByModel: 'ClientUser',
      targetId: supplier._id,
      targetModel: 'Supplier',
      description: `Supplier ${supplier.name} deactivated`,
      ipAddress: req.ip,
      severity: 'info'
    });

    res.json({ message: 'Supplier deactivated.' });
  } catch (error) {
    console.error('Delete supplier error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const getSupplierPerformance = async (req, res) => {
  try {
    const suppliers = await Supplier.find({
      organizationId: req.user.organizationId,
      isActive: true
    })
      .select('name reliabilityScore onTimeDeliveries lateDeliveries totalOrders rating')
      .sort({ reliabilityScore: -1 });

    res.json(suppliers);
  } catch (error) {
    console.error('Supplier performance error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getSupplierPerformance
};