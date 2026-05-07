import Customer from '../../models/client/CustomerModel.js';
import AuditLog from '../../models/admin/AuditLogModel.js';

const getCustomers = async (req, res) => {
  try {
    const tenantId = req.user.organizationId;
    const { page = 1, limit = 20, search, customerType, highChurn } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = { organizationId: tenantId, isActive: true };
    if (customerType) query.customerType = customerType;
    if (highChurn === 'true') query.churnRisk = { $gte: 60 };
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const [customers, total] = await Promise.all([
      Customer.find(query)
        .sort({ fullName: 1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Customer.countDocuments(query)
    ]);

    res.json({
      customers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      _id: req.params.id,
      organizationId: req.user.organizationId
    });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found.' });
    }
    res.json(customer);
  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const createCustomer = async (req, res) => {
  try {
    const { fullName, email, phone, address, customerType, tags, notes } = req.body;

    if (!fullName) {
      return res.status(400).json({ message: 'Full name is required.' });
    }

    const customer = await Customer.create({
      organizationId: req.user.organizationId,
      fullName,
      email: email ? email.toLowerCase() : '',
      phone: phone || '',
      address: address || {},
      customerType: customerType || 'individual',
      tags: tags || [],
      notes: notes || ''
    });

    await AuditLog.create({
      organizationId: req.user.organizationId,
      action: 'Customer created',
      actionType: 'customer_created',
      performedBy: req.user._id,
      performedByModel: 'ClientUser',
      targetId: customer._id,
      targetModel: 'Customer',
      description: `Customer ${customer.fullName} created`,
      ipAddress: req.ip,
      severity: 'info'
    });

    res.status(201).json(customer);
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      _id: req.params.id,
      organizationId: req.user.organizationId
    });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found.' });
    }

    const { fullName, email, phone, address, customerType, tags, notes } = req.body;

    if (fullName) customer.fullName = fullName;
    if (email) customer.email = email.toLowerCase();
    if (phone !== undefined) customer.phone = phone;
    if (address) customer.address = { ...customer.address, ...address };
    if (customerType) customer.customerType = customerType;
    if (tags) customer.tags = tags;
    if (notes !== undefined) customer.notes = notes;

    await customer.save();

    await AuditLog.create({
      organizationId: req.user.organizationId,
      action: 'Customer updated',
      actionType: 'customer_updated',
      performedBy: req.user._id,
      performedByModel: 'ClientUser',
      targetId: customer._id,
      targetModel: 'Customer',
      description: `Customer ${customer.fullName} updated`,
      ipAddress: req.ip,
      severity: 'info'
    });

    res.json(customer);
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOneAndUpdate(
      { _id: req.params.id, organizationId: req.user.organizationId },
      { isActive: false },
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found.' });
    }

    await AuditLog.create({
      organizationId: req.user.organizationId,
      action: 'Customer deactivated',
      actionType: 'customer_deleted',
      performedBy: req.user._id,
      performedByModel: 'ClientUser',
      targetId: customer._id,
      targetModel: 'Customer',
      description: `Customer ${customer.fullName} deactivated`,
      ipAddress: req.ip,
      severity: 'info'
    });

    res.json({ message: 'Customer deactivated.' });
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const getCustomerStats = async (req, res) => {
  try {
    const tenantId = req.user.organizationId;

    const [totalActive, atRisk, topSpenders] = await Promise.all([
      Customer.countDocuments({ organizationId: tenantId, isActive: true }),
      Customer.countDocuments({ organizationId: tenantId, isActive: true, churnRisk: { $gte: 60 } }),
      Customer.find({ organizationId: tenantId, isActive: true })
        .sort({ totalSpent: -1 })
        .limit(10)
        .select('fullName totalSpent purchaseCount lastPurchaseDate churnRisk')
    ]);

    res.json({ totalActive, atRisk, topSpenders });
  } catch (error) {
    console.error('Customer stats error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerStats
};