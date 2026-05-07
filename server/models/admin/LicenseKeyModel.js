import mongoose from 'mongoose';

const licenseKeySchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClientOrg',
      required: true
    },
    plan: {
      type: String,
      enum: ['trial', 'standard', 'proplus'],
      required: true
    },
    billingCycle: {
      type: String,
      enum: ['monthly', 'yearly', 'permanent', 'trial'],
      required: true
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'revoked', 'suspended'],
      default: 'active'
    },
    activatedAt: {
      type: Date,
      default: Date.now
    },
    expiresAt: {
      type: Date,
      default: null
    },
    revokedAt: {
      type: Date,
      default: null
    },
    revokedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminUser',
      default: null
    },
    revocationReason: {
      type: String,
      default: ''
    },
    deviceId: {
      type: String,
      default: null
    },
    isFirstActivation: {
      type: Boolean,
      default: true
    },
    generatedBy: {
      type: String,
      enum: ['system', 'admin', 'payment'],
      default: 'system'
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      default: null
    }
  },
  { timestamps: true }
);

licenseKeySchema.methods.isExpired = function () {
  if (!this.expiresAt) return false;
  return new Date() > this.expiresAt;
};

licenseKeySchema.methods.revoke = async function (adminId, reason) {
  this.status = 'revoked';
  this.revokedAt = new Date();
  this.revokedBy = adminId;
  this.revocationReason = reason;
  return this.save();
};

const LicenseKey = mongoose.model('LicenseKey', licenseKeySchema);

export default LicenseKey;