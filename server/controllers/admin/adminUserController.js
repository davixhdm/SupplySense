import AdminUser from '../../models/admin/AdminUserModel.js';
import AuditLog from '../../models/admin/AuditLogModel.js';

const getAdminUsers = async (req, res) => {
  try {
    const users = await AdminUser.find().select('-password -loginAttempts -lockUntil -resetPasswordToken -resetPasswordExpires').sort({ fullName: 1 });
    res.json(users);
  } catch (error) {
    console.error('Get admin users error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const getAdminUserById = async (req, res) => {
  try {
    const user = await AdminUser.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  } catch (error) {
    console.error('Get admin user error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const createAdminUser = async (req, res) => {
  try {
    const { fullName, email, password, role, phone } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Full name, email, and password required.' });
    }

    const existing = await AdminUser.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ message: 'Email already in use.' });

    const user = await AdminUser.create({
      fullName,
      email: email.toLowerCase(),
      password,
      role: role || 'moderator',
      phone: phone || '',
      createdBy: req.admin._id
    });

    await AuditLog.create({
      action: 'Admin user created',
      actionType: 'user_created',
      performedBy: req.admin._id,
      performedByModel: 'AdminUser',
      targetId: user._id,
      description: `Admin ${user.fullName} created with role ${user.role}`,
      severity: 'info'
    });

    res.status(201).json(user.toSafeObject());
  } catch (error) {
    console.error('Create admin user error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const updateAdminUser = async (req, res) => {
  try {
    const { fullName, role, isActive, phone } = req.body;
    const updates = {};
    if (fullName) updates.fullName = fullName;
    if (role) updates.role = role;
    if (isActive !== undefined) updates.isActive = isActive;
    if (phone !== undefined) updates.phone = phone;

    const user = await AdminUser.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    await AuditLog.create({
      action: 'Admin user updated',
      actionType: 'user_updated',
      performedBy: req.admin._id,
      performedByModel: 'AdminUser',
      targetId: user._id,
      description: `Admin user ${user.fullName} updated`,
      severity: 'info'
    });

    res.json(user.toSafeObject());
  } catch (error) {
    console.error('Update admin user error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const deleteAdminUser = async (req, res) => {
  try {
    const user = await AdminUser.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    await AuditLog.create({
      action: 'Admin user deactivated',
      actionType: 'user_deleted',
      performedBy: req.admin._id,
      performedByModel: 'AdminUser',
      targetId: user._id,
      description: `Admin user ${user.fullName} deactivated`,
      severity: 'warning'
    });

    res.json({ message: 'User deactivated.' });
  } catch (error) {
    console.error('Delete admin user error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export {
  getAdminUsers,
  getAdminUserById,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser
};