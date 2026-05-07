import crypto from 'crypto';
import env from '../config/env.js';
import LicenseKey from '../models/admin/LicenseKeyModel.js';
import { sendLicenseKeyEmail, sendLicenseKeySMS } from './notification/index.js';

const generateKeyString = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const segment = () => {
    let result = '';
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(crypto.randomInt(0, chars.length));
    }
    return result;
  };
  return `${env.LICENSE_KEY_PREFIX}-${segment()}-${segment()}-${segment()}`;
};

export const generateLicenseKey = async (organizationId, plan, billingCycle, paymentId = null, generatedBy = 'system') => {
  let keyString;
  let exists = true;
  let attempts = 0;
  
  while (exists && attempts < 10) {
    keyString = generateKeyString();
    exists = await LicenseKey.findOne({ key: keyString });
    attempts++;
  }
  
  if (exists) throw new Error('Failed to generate unique license key');

  let expiresAt = null;
  if (billingCycle === 'monthly') {
    expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  } else if (billingCycle === 'yearly') {
    expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
  } else if (billingCycle === 'trial') {
    expiresAt = new Date(Date.now() + env.TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000);
  }

  const license = await LicenseKey.create({
    key: keyString,
    organizationId,
    plan,
    billingCycle,
    status: 'active',
    activatedAt: new Date(),
    expiresAt,
    generatedBy,
    paymentId
  });

  return license;
};

export const revokeLicense = async (licenseId, adminId, reason) => {
  const license = await LicenseKey.findById(licenseId);
  if (!license) throw new Error('License not found');
  return license.revoke(adminId, reason);
};

export const verifyLicenseKey = async (keyString, deviceId) => {
  const license = await LicenseKey.findOne({ key: keyString });
  if (!license) return { valid: false, reason: 'License key not found' };
  if (license.status === 'revoked') return { valid: false, reason: 'License key has been revoked' };
  if (license.status === 'suspended') return { valid: false, reason: 'License is suspended' };
  if (license.isExpired()) return { valid: false, reason: 'License key has expired' };
  
  return { valid: true, license };
};

export const sendLicenseToClient = async (license, organization) => {
  if (organization.email) {
    await sendLicenseKeyEmail(organization.email, {
      licenseKey: license.key,
      plan: license.plan,
      billingCycle: license.billingCycle,
      expiryDate: license.expiresAt,
      fullName: organization.organizationName
    });
  }
  
  if (organization.phone) {
    await sendLicenseKeySMS(organization.phone, license.key);
  }
};