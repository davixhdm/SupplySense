import mongoose from 'mongoose';

const deviceSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClientOrg',
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClientUser',
      default: null
    },
    deviceId: {
      type: String,
      required: true
    },
    deviceName: {
      type: String,
      default: '',
      trim: true
    },
    deviceType: {
      type: String,
      enum: ['desktop', 'laptop', 'tablet', 'mobile', 'other'],
      default: 'desktop'
    },
    operatingSystem: {
      type: String,
      default: '',
      trim: true
    },
    browser: {
      type: String,
      default: '',
      trim: true
    },
    ipAddress: {
      type: String,
      default: ''
    },
    location: {
      city: { type: String, default: '' },
      country: { type: String, default: '' }
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    verifiedAt: {
      type: Date,
      default: null
    },
    verificationMethod: {
      type: String,
      enum: ['otp', 'link', 'admin', 'license', ''],
      default: ''
    },
    verificationOTP: {
      type: String,
      default: null
    },
    verificationOTPExpires: {
      type: Date,
      default: null
    },
    lastActive: {
      type: Date,
      default: Date.now
    },
    deactivatedAt: {
      type: Date,
      default: null
    },
    deactivatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'deactivatedByModel',
      default: null
    },
    deactivatedByModel: {
      type: String,
      enum: ['ClientUser', 'AdminUser'],
      default: null
    },
    deactivationReason: {
      type: String,
      default: ''
    },
    trustLevel: {
      type: String,
      enum: ['trusted', 'new', 'suspicious'],
      default: 'new'
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  { timestamps: true }
);

deviceSchema.index({ organizationId: 1, userId: 1 });
deviceSchema.index({ deviceId: 1 }, { unique: true });
deviceSchema.index({ organizationId: 1, isActive: 1 });

deviceSchema.methods.deactivate = async function (deactivatedBy, deactivatedByModel, reason) {
  this.isActive = false;
  this.deactivatedAt = new Date();
  this.deactivatedBy = deactivatedBy;
  this.deactivatedByModel = deactivatedByModel;
  this.deactivationReason = reason;
  return this.save();
};

deviceSchema.methods.updateActivity = async function (ipAddress, browser, os) {
  this.lastActive = new Date();
  if (ipAddress) this.ipAddress = ipAddress;
  if (browser) this.browser = browser;
  if (os) this.operatingSystem = os;
  return this.save();
};

deviceSchema.methods.verify = async function (method) {
  this.isVerified = true;
  this.verifiedAt = new Date();
  this.verificationMethod = method;
  this.trustLevel = 'trusted';
  return this.save();
};

const Device = mongoose.model('Device', deviceSchema);

export default Device;