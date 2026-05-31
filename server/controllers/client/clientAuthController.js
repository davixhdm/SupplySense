import crypto from 'crypto';
import ClientUser from '../../models/client/ClientUserModel.js';
import ClientOrg from '../../models/admin/ClientOrgModel.js';
import Device from '../../models/client/DeviceModel.js';
import LicenseKey from '../../models/admin/LicenseKeyModel.js';
import PendingActivation from '../../models/admin/PendingActivationModel.js';
import Payment from '../../models/admin/PaymentModel.js';
import SystemSettings from '../../models/admin/SystemSettingsModel.js';
import AuditLog from '../../models/admin/AuditLogModel.js';
import { generateClientToken } from '../../utils/tokenUtils.js';
import { isValidEmail, isValidPassword, isValidLicenseKey } from '../../utils/validationUtils.js';
import { generateLicenseKey, verifyLicenseKey, sendLicenseToClient } from '../../services/licenseService.js';
import { sendDeviceVerificationEmail, sendDeviceOTPSMS, sendPasswordResetEmail, sendPaymentConfirmationEmail, sendPaymentConfirmationSMS } from '../../services/notification/index.js';
import { generateOTP, generateRandomToken } from '../../services/encryptionService.js';
import env from '../../config/env.js';

const clientLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }

    const user = await ClientUser.findOne({ email: email.toLowerCase() });
    if (!user) {
      await AuditLog.create({
        action: 'Failed client login',
        actionType: 'auth_failed',
        description: `Login attempted with email: ${email}`,
        ipAddress: req.ip,
        severity: 'warning'
      });
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account deactivated.' });
    }

    if (user.isLocked()) {
      return res.status(403).json({ message: 'Account temporarily locked. Try again later.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      await user.incrementLoginAttempts();
      await AuditLog.create({
        organizationId: user.organizationId,
        action: 'Failed client login',
        actionType: 'auth_failed',
        performedBy: user._id,
        performedByModel: 'ClientUser',
        description: 'Incorrect password',
        ipAddress: req.ip,
        severity: 'warning'
      });
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const organization = await ClientOrg.findById(user.organizationId);
    if (!organization) {
      return res.status(403).json({ message: 'Organization not found.' });
    }

    if (organization.isSuspended) {
      return res.status(403).json({ message: 'Organization has been suspended.' });
    }

    if (!organization.isActive) {
      return res.status(403).json({
        message: 'Your application is under admin review. You will receive an email with your license key once approved.',
        pendingApproval: true
      });
    }

    if (organization.plan === 'trial' && organization.trialEndDate && new Date() > organization.trialEndDate) {
      return res.status(403).json({ message: 'Trial expired. Please upgrade.' });
    }

    if (organization.isPlanExpired()) {
      return res.status(403).json({ message: 'Subscription expired. Please renew.' });
    }

    if (organization.plan !== 'trial' && !organization.licenseKey) {
      return res.status(403).json({
        message: 'Your application is under admin review. You will receive an email with your license key once approved.',
        pendingApproval: true
      });
    }

    const deviceId = req.headers['x-device-id'];
    if (!deviceId) {
      return res.status(400).json({
        message: 'Device ID is required. Activate your license first.',
        requireActivation: true
      });
    }

    const device = await Device.findOne({
      deviceId,
      organizationId: user.organizationId,
      isActive: true,
      isVerified: true
    });

    if (!device) {
      return res.status(403).json({
        message: 'Device not activated. Please activate your license first.',
        requireActivation: true
      });
    }

    await user.resetLoginAttempts();
    user.lastLoginIp = req.ip;
    await user.save();

    const token = generateClientToken(user._id, user.organizationId, user.role);

    await AuditLog.create({
      organizationId: user.organizationId,
      action: 'Client logged in',
      actionType: 'auth_login',
      performedBy: user._id,
      performedByModel: 'ClientUser',
      description: `${user.fullName} logged in from device ${deviceId}`,
      deviceId,
      ipAddress: req.ip,
      severity: 'info'
    });

    res.status(200).json({
      message: 'Login successful.',
      token,
      user: user.toSafeObject(),
      organization: {
        name: organization.organizationName,
        plan: organization.plan,
        billingCycle: organization.billingCycle,
        planEndDate: organization.planEndDate,
        trialEndDate: organization.trialEndDate,
        enabledModules: organization.enabledModules
      }
    });
  } catch (error) {
    console.error('Client login error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const clientLogout = async (req, res) => {
  try {
    await AuditLog.create({
      organizationId: req.user.organizationId,
      action: 'Client logged out',
      actionType: 'auth_logout',
      performedBy: req.user._id,
      performedByModel: 'ClientUser',
      description: `${req.user.fullName} logged out`,
      ipAddress: req.ip,
      severity: 'info'
    });
    res.status(200).json({ message: 'Logged out successfully.' });
  } catch (error) {
    console.error('Client logout error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const registerOrganization = async (req, res) => {
  try {
    const { organizationName, fullName, email, phone, password, plan, billingCycle, industry } = req.body;

    if (!organizationName || !fullName || !email || !password || !plan) {
      return res.status(400).json({ message: 'Required fields missing.' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    }

    const existingOrg = await ClientOrg.findOne({ email: email.toLowerCase() });
    if (existingOrg) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    const validPlans = ['trial', 'standard', 'proplus'];
    if (!validPlans.includes(plan)) {
      return res.status(400).json({ message: 'Invalid plan.' });
    }

    let trialEndDate = null;
    let planEndDate = null;

    if (plan === 'trial') {
      trialEndDate = new Date(Date.now() + env.TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000);
    }

    const organization = await ClientOrg.create({
      organizationName,
      slug: organizationName,
      email: email.toLowerCase(),
      phone: phone || '',
      industry: industry || 'other',
      plan,
      billingCycle: plan === 'trial' ? 'trial' : billingCycle,
      trialEndDate,
      planEndDate,
      licenseKey: null,
      isActive: plan === 'trial',
      planStartDate: new Date(),
      maxUsers: plan === 'trial' ? 1 : plan === 'standard' ? 10 : 999999,
      maxProducts: plan === 'trial' ? 50 : plan === 'standard' ? 5000 : 999999,
      maxSuppliers: plan === 'trial' ? 10 : plan === 'standard' ? 200 : 999999,
      settings: {
        currency: env.DEFAULT_CURRENCY,
        dateFormat: 'DD/MM/YYYY',
        notificationChannels: { email: true, sms: false, whatsapp: false }
      }
    });

    let licenseKeyStr = null;
    if (plan === 'trial') {
      const license = await generateLicenseKey(organization._id, 'trial', 'trial', null, 'system');
      licenseKeyStr = license.key;
      organization.licenseKey = licenseKeyStr;
      await organization.save();
    }

    const user = await ClientUser.create({
      organizationId: organization._id,
      fullName,
      email: email.toLowerCase(),
      password,
      role: 'admin',
      department: 'management',
      phone: phone || '',
      isVerified: true
    });

    await AuditLog.create({
      organizationId: organization._id,
      action: 'Organization registered',
      actionType: 'user_created',
      description: `${organizationName} registered on ${plan} plan`,
      ipAddress: req.ip,
      severity: 'info'
    });

    if (plan === 'trial') {
      const token = generateClientToken(user._id, organization._id, 'admin');
      return res.status(201).json({
        message: 'Registration successful.',
        token,
        user: user.toSafeObject(),
        organization: {
          name: organization.organizationName,
          plan: organization.plan,
          licenseKey: licenseKeyStr,
          trialEndDate: organization.trialEndDate,
          planEndDate: organization.planEndDate
        }
      });
    }

    res.status(201).json({
      message: 'Registration successful. Please complete payment to activate your account.',
      user: user.toSafeObject(),
      organization: {
        name: organization.organizationName,
        plan: organization.plan,
        billingCycle: organization.billingCycle
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const activateLicense = async (req, res) => {
  try {
    const { licenseKey, deviceId, deviceName, deviceType, operatingSystem, browser } = req.body;

    if (!licenseKey || !deviceId) {
      return res.status(400).json({ message: 'License key and device ID are required.' });
    }

    if (!isValidLicenseKey(licenseKey)) {
      return res.status(400).json({ message: 'Invalid license key format.' });
    }

    const verification = await verifyLicenseKey(licenseKey, deviceId);
    if (!verification.valid) {
      return res.status(400).json({ message: verification.reason });
    }

    const license = verification.license;
    const organization = await ClientOrg.findById(license.organizationId);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found.' });
    }

    license.deviceId = deviceId;
    license.isFirstActivation = false;
    await license.save();

    const existingDevice = await Device.findOne({ deviceId, organizationId: organization._id, isActive: true });
    if (!existingDevice) {
      await Device.create({
        organizationId: organization._id,
        deviceId,
        deviceName: deviceName || 'Unknown Device',
        deviceType: deviceType || 'desktop',
        operatingSystem: operatingSystem || '',
        browser: browser || '',
        ipAddress: req.ip,
        isVerified: true,
        verifiedAt: new Date(),
        verificationMethod: 'license',
        trustLevel: 'trusted'
      });
    }

    await AuditLog.create({
      organizationId: organization._id,
      action: 'Device activated via license',
      actionType: 'device_activated',
      description: `Device ${deviceId} activated with license key`,
      deviceId,
      ipAddress: req.ip,
      severity: 'info'
    });

    res.status(200).json({
      message: 'License activated successfully.',
      organizationId: organization._id,
      organizationName: organization.organizationName,
      plan: license.plan,
      billingCycle: license.billingCycle,
      expiresAt: license.expiresAt
    });
  } catch (error) {
    console.error('Activate license error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const verifyDevice = async (req, res) => {
  try {
    const { deviceId, otp } = req.body;
    if (!deviceId || !otp) return res.status(400).json({ message: 'Device ID and OTP are required.' });

    const device = await Device.findOne({ deviceId, organizationId: req.user.organizationId, userId: req.user._id, isActive: true });
    if (!device) return res.status(404).json({ message: 'Device not found.' });
    if (device.isVerified) return res.status(400).json({ message: 'Device already verified.' });
    if (device.verificationOTP !== otp) return res.status(400).json({ message: 'Invalid OTP.' });
    if (device.verificationOTPExpires && new Date() > device.verificationOTPExpires) return res.status(400).json({ message: 'OTP expired.' });

    await device.verify('otp');
    res.status(200).json({ message: 'Device verified successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const sendDeviceOTP = async (req, res) => {
  try {
    const { deviceId } = req.body;
    if (!deviceId) return res.status(400).json({ message: 'Device ID is required.' });

    const device = await Device.findOne({ deviceId, organizationId: req.user.organizationId, userId: req.user._id, isActive: true });
    if (!device) return res.status(404).json({ message: 'Device not found.' });

    const otp = generateOTP(6);
    device.verificationOTP = otp;
    device.verificationOTPExpires = new Date(Date.now() + 10 * 60 * 1000);
    await device.save();

    if (req.user.email) await sendDeviceVerificationEmail(req.user.email, otp);
    if (req.user.phone) await sendDeviceOTPSMS(req.user.phone, otp);
    res.status(200).json({ message: 'OTP sent successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required.' });

    const user = await ClientUser.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(200).json({ message: 'If the email exists, a reset link has been sent.' });

    const resetToken = generateRandomToken();
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    const resetUrl = `${env.CLIENT_APP_URL}/reset-password/${resetToken}`;
    await sendPasswordResetEmail(user.email, resetUrl);
    res.status(200).json({ message: 'If the email exists, a reset link has been sent.' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ message: 'Token and new password are required.' });
    if (!isValidPassword(newPassword)) return res.status(400).json({ message: 'Password must be at least 8 characters long.' });

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await ClientUser.findOne({ resetPasswordToken: hashedToken, resetPasswordExpires: { $gt: new Date() } });
    if (!user) return res.status(400).json({ message: 'Invalid or expired reset token.' });

    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
    res.status(200).json({ message: 'Password reset successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const submitManualPayment = async (req, res) => {
  try {
    const { plan, billingCycle, amount, currency, paymentMethod, paymentDetails } = req.body;
    if (!plan || !billingCycle || !amount || !paymentMethod) return res.status(400).json({ message: 'Missing payment details.' });

    const validMethods = ['mpesa_send', 'mpesa_paybill', 'mpesa_till'];
    if (!validMethods.includes(paymentMethod)) return res.status(400).json({ message: 'Invalid payment method for manual submission.' });

    const organization = await ClientOrg.findById(req.user.organizationId);
    const pendingActivation = await PendingActivation.create({
      organizationId: organization._id,
      userEmail: req.user.email,
      userPhone: req.user.phone || paymentDetails?.phoneNumber || '',
      fullName: req.user.fullName,
      plan, billingCycle, amount,
      currency: currency || 'KSh',
      paymentMethod, paymentDetails,
      paymentConfirmed: false,
      confirmationMethod: 'manual',
      status: 'pending',
      submittedAt: new Date(),
      expiresAt: new Date(Date.now() + 3 * 60 * 60 * 1000)
    });

    if (req.user.phone) await sendPaymentConfirmationSMS(req.user.phone);
    if (req.user.email) await sendPaymentConfirmationEmail(req.user.email, { amount, currency: currency || 'KSh', plan, billingCycle });

    res.status(201).json({
      message: 'Payment submitted for verification. You will receive your license key within 24 hours.',
      referenceNumber: pendingActivation._id
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await ClientUser.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user.toSafeObject());
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { fullName, phone } = req.body;
    const updateFields = {};
    if (fullName) updateFields.fullName = fullName;
    if (phone !== undefined) updateFields.phone = phone;
    const user = await ClientUser.findByIdAndUpdate(req.user._id, updateFields, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user.toSafeObject());
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const changeClientPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ message: 'Current and new password are required.' });
    if (!isValidPassword(newPassword)) return res.status(400).json({ message: 'Password must be at least 8 characters.' });

    const user = await ClientUser.findById(req.user._id);
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect.' });

    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password changed successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const getPublicSettings = async (req, res) => {
  try {
    const settings = await SystemSettings.findOne().select('systemName general footer legal pricing paymentConfig aiConfig');
    if (!settings) {
      return res.json({
        systemName: 'SupplySense',
        general: { heroTitle: 'Intelligent Supply Chain Management', heroSubtitle: 'Predict, monitor, and optimize your supply chain with AI-powered insights.', aboutContent: '', email: '', phone: '', address: '' },
        footer: { copyright: 'SupplySense Systems', columns: [] },
        legal: { terms: '', privacy: '', cookies: '' },
        pricing: { trial: { duration: 14 }, standard: { monthly: 0, yearly: 0, permanent: 0 }, proplus: { monthly: 0, yearly: 0, permanent: 0 } },
        paymentConfig: { currency: 'KSh' },
        aiConfig: { landingChatEnabled: true, chatbotTitle: 'SupplySense Assistant', chatbotColor: '#2563eb' }
      });
    }

    const rates = { KSh: 1, USD: 0.0067, EUR: 0.0062, GBP: 0.0053 };
    const fromKSh = (amount, toCurrency) => {
      if (toCurrency === 'KSh') return amount;
      return Math.round(amount * rates[toCurrency] * 100) / 100;
    };

    const currency = settings.paymentConfig?.currency || 'KSh';
    const p = settings.pricing;
    const converted = {
      trial: { duration: p.trial.duration },
      standard: { monthly: fromKSh(p.standard.monthly, currency), yearly: fromKSh(p.standard.yearly, currency), permanent: fromKSh(p.standard.permanent, currency) },
      proplus: { monthly: fromKSh(p.proplus.monthly, currency), yearly: fromKSh(p.proplus.yearly, currency), permanent: fromKSh(p.proplus.permanent, currency) }
    };

    const settingsObj = settings.toObject();
    settingsObj.pricing = converted;
    res.json(settingsObj);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};
const registerWithPayment = async (req, res) => {
  try {
    const { organizationName, fullName, email, phone, password, plan, billingCycle, amount, currency, paymentMethod, paymentDetails, paymentConfirmed, confirmationMethod } = req.body;

    if (!organizationName || !fullName || !email || !password || !plan || !billingCycle || !amount || !paymentMethod) {
      return res.status(400).json({ message: 'Required fields missing.' });
    }

    if (!isValidEmail(email)) return res.status(400).json({ message: 'Invalid email format.' });
    if (!isValidPassword(password)) return res.status(400).json({ message: 'Password must be at least 8 characters.' });

    const existingOrg = await ClientOrg.findOne({ email: email.toLowerCase() });
    if (existingOrg) return res.status(400).json({ message: 'An account with this email already exists.' });

    const organization = await ClientOrg.create({
      organizationName,
      slug: organizationName,
      email: email.toLowerCase(),
      phone: phone || '',
      plan,
      billingCycle,
      isActive: false,
      planStartDate: new Date(),
      maxUsers: plan === 'standard' ? 10 : 999999,
      maxProducts: plan === 'standard' ? 5000 : 999999,
      maxSuppliers: plan === 'standard' ? 200 : 999999,
      settings: { currency: currency || env.DEFAULT_CURRENCY, dateFormat: 'DD/MM/YYYY', notificationChannels: { email: true, sms: false, whatsapp: false } }
    });

    await ClientUser.create({
      organizationId: organization._id,
      fullName, email: email.toLowerCase(), password,
      role: 'admin', department: 'management',
      phone: phone || '', isVerified: true
    });

    await PendingActivation.create({
      organizationId: organization._id,
      userEmail: email.toLowerCase(),
      userPhone: phone || '',
      fullName,
      plan, billingCycle, amount,
      currency: currency || 'KSh',
      paymentMethod,
      paymentDetails,
      paymentConfirmed: paymentConfirmed || false,
      confirmationMethod: confirmationMethod || 'pending',
      status: 'pending',
      submittedAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });

    res.status(201).json({ message: 'Application submitted for review.' });
  } catch (error) {
    console.error('Register with payment error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export {
  clientLogin, clientLogout, registerOrganization, activateLicense,
  verifyDevice, sendDeviceOTP, forgotPassword, resetPassword,
  submitManualPayment, getProfile, updateProfile, changeClientPassword,
  registerWithPayment,
  getPublicSettings
};