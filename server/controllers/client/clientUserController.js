import ClientUser from '../../models/client/ClientUserModel.js';
import AuditLog from '../../models/admin/AuditLogModel.js';
import { sendDeviceVerificationEmail, sendDeviceOTPSMS } from '../../services/notification/index.js';
import { generateOTP } from '../../services/encryptionService.js';

const getUsers = async (req, res) => {
  try {
    const users = await ClientUser.find({ organizationId: req.user.organizationId })
      .select('-password -loginAttempts -lockUntil -resetPasswordToken -resetPasswordExpires -verificationToken')
      .sort({ fullName: 1 });

    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await ClientUser.findOne({
      _id: req.params.id,
      organizationId: req.user.organizationId
    }).select('-password -loginAttempts -lockUntil');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const createUser = async (req, res) => {
  try {
    const { fullName, email, phone, password, role, department } = req.body;

    if (!fullName || !email || !password || !role) {
      return res.status(400).json({ message: 'Full name, email, password, and role are required.' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can create users.' });
    }

    const existing = await ClientUser.findOne({ organizationId: req.user.organizationId, email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    const user = await ClientUser.create({
      organizationId: req.user.organizationId,
      fullName,
      email: email.toLowerCase(),
      password,
      phone: phone || '',
      role,
      department: department || 'other',
      createdBy: req.user._id
    });

    const otp = generateOTP(6);
    user.verificationToken = otp;
    user.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    if (email) await sendDeviceVerificationEmail(email, otp);
    if (phone) await sendDeviceOTPSMS(phone, otp);

    await AuditLog.create({
      organizationId: req.user.organizationId,
      action: 'User created',
      actionType: 'user_created',
      performedBy: req.user._id,
      performedByModel: 'ClientUser',
      targetId: user._id,
      targetModel: 'ClientUser',
      description: `User ${user.fullName} created with role ${role}`,
      ipAddress: req.ip,
      severity: 'info'
    });

    const safeUser = user.toSafeObject();
    res.status(201).json(safeUser);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { fullName, phone, role, department, isActive } = req.body;

    const user = await ClientUser.findOne({
      _id: req.params.id,
      organizationId: req.user.organizationId
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (req.user.role !== 'admin' && req.user._id.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    if (fullName) user.fullName = fullName;
    if (phone !== undefined) user.phone = phone;
    if (role && req.user.role === 'admin') user.role = role;
    if (department && req.user.role === 'admin') user.department = department;
    if (isActive !== undefined && req.user.role === 'admin') user.isActive = isActive;

    await user.save();

    await AuditLog.create({
      organizationId: req.user.organizationId,
      action: 'User updated',
      actionType: 'user_updated',
      performedBy: req.user._id,
      performedByModel: 'ClientUser',
      targetId: user._id,
      targetModel: 'ClientUser',
      description: `User ${user.fullName} updated`,
      ipAddress: req.ip,
      severity: 'info'
    });

    res.json(user.toSafeObject());
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const deleteUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can delete users.' });
    }

    const user = await ClientUser.findOneAndUpdate(
      { _id: req.params.id, organizationId: req.user.organizationId },
      { isActive: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    await AuditLog.create({
      organizationId: req.user.organizationId,
      action: 'User deactivated',
      actionType: 'user_deleted',
      performedBy: req.user._id,
      performedByModel: 'ClientUser',
      targetId: user._id,
      targetModel: 'ClientUser',
      description: `User ${user.fullName} deactivated`,
      ipAddress: req.ip,
      severity: 'info'
    });

    res.json({ message: 'User deactivated.' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};