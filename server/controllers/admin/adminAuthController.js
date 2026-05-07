import AdminUser from '../../models/admin/AdminUserModel.js';
import AuditLog from '../../models/admin/AuditLogModel.js';
import { generateAdminToken } from '../../utils/tokenUtils.js';
import { isValidEmail, isValidPassword } from '../../utils/validationUtils.js';
import { generateRandomToken } from '../../services/encryptionService.js';
import { sendPasswordResetEmail } from '../../services/notification/index.js';
import crypto from 'crypto';
import env from '../../config/env.js';

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }

    const admin = await AdminUser.findOne({ email: email.toLowerCase() });
    if (!admin) {
      await AuditLog.create({
        action: 'Failed admin login',
        actionType: 'auth_failed',
        description: `Login attempted with email: ${email}`,
        ipAddress: req.ip,
        severity: 'warning'
      });
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (!admin.isActive) {
      return res.status(403).json({ message: 'Account deactivated.' });
    }

    if (admin.isLocked()) {
      return res.status(403).json({ message: 'Account temporarily locked.' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      await admin.incrementLoginAttempts();
      await AuditLog.create({
        action: 'Failed admin login',
        actionType: 'auth_failed',
        performedBy: admin._id,
        performedByModel: 'AdminUser',
        description: 'Incorrect password',
        ipAddress: req.ip,
        severity: 'warning'
      });
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    await admin.resetLoginAttempts();
    const token = generateAdminToken(admin._id, admin.role);

    await AuditLog.create({
      action: 'Admin logged in',
      actionType: 'auth_login',
      performedBy: admin._id,
      performedByModel: 'AdminUser',
      description: `${admin.fullName} logged in`,
      ipAddress: req.ip,
      severity: 'info'
    });

    res.json({
      message: 'Login successful.',
      token,
      admin: admin.toSafeObject()
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const adminLogout = async (req, res) => {
  try {
    await AuditLog.create({
      action: 'Admin logged out',
      actionType: 'auth_logout',
      performedBy: req.admin._id,
      performedByModel: 'AdminUser',
      description: `${req.admin.fullName} logged out`,
      ipAddress: req.ip,
      severity: 'info'
    });
    res.json({ message: 'Logged out.' });
  } catch (error) {
    console.error('Admin logout error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const getProfile = async (req, res) => {
  try {
    const admin = await AdminUser.findById(req.admin._id);
    if (!admin) return res.status(404).json({ message: 'Admin not found.' });
    res.json(admin.toSafeObject());
  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { fullName, phone } = req.body;
    const updateFields = {};
    if (fullName) updateFields.fullName = fullName;
    if (phone !== undefined) updateFields.phone = phone;

    const admin = await AdminUser.findByIdAndUpdate(req.admin._id, updateFields, { new: true });
    if (!admin) return res.status(404).json({ message: 'Admin not found.' });
    res.json(admin.toSafeObject());
  } catch (error) {
    console.error('Update admin profile error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required.' });
    }
    if (!isValidPassword(newPassword)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters.' });
    }

    const admin = await AdminUser.findById(req.admin._id);
    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password incorrect.' });
    }

    admin.password = newPassword;
    await admin.save();

    await AuditLog.create({
      action: 'Admin password changed',
      actionType: 'settings_updated',
      performedBy: admin._id,
      performedByModel: 'AdminUser',
      description: 'Password changed',
      ipAddress: req.ip,
      severity: 'info'
    });

    res.json({ message: 'Password changed successfully.' });
  } catch (error) {
    console.error('Admin change password error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email required.' });

    const admin = await AdminUser.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.json({ message: 'If email exists, reset link sent.' });
    }

    const resetToken = generateRandomToken();
    admin.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    admin.resetPasswordExpires = new Date(Date.now() + 3600000);
    await admin.save();

    const resetUrl = `${env.ADMIN_APP_URL}/admin/reset-password/${resetToken}`;
    await sendPasswordResetEmail(admin.email, resetUrl);

    res.json({ message: 'If email exists, reset link sent.' });
  } catch (error) {
    console.error('Admin forgot password error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ message: 'Token and password required.' });
    if (!isValidPassword(newPassword)) return res.status(400).json({ message: 'Password at least 8 characters.' });

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const admin = await AdminUser.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!admin) return res.status(400).json({ message: 'Invalid or expired token.' });

    admin.password = newPassword;
    admin.resetPasswordToken = null;
    admin.resetPasswordExpires = null;
    await admin.save();

    res.json({ message: 'Password reset successfully.' });
  } catch (error) {
    console.error('Admin reset password error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export {
  adminLogin,
  adminLogout,
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword
};