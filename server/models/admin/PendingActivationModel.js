import mongoose from 'mongoose';

const pendingActivationSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClientOrg',
      required: true
    },
    userEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    userPhone: {
      type: String,
      default: ''
    },
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    plan: {
      type: String,
      enum: ['standard', 'proplus'],
      required: true
    },
    billingCycle: {
      type: String,
      enum: ['monthly', 'yearly', 'permanent'],
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      enum: ['KSh', 'USD', 'EUR', 'GBP'],
      required: true
    },
    paymentMethod: {
      type: String,
      enum: ['stripe', 'mpesa_stk', 'mpesa_send', 'mpesa_paybill', 'mpesa_till', 'paypal'],
      required: true
    },
    paymentDetails: {
      phoneNumber: { type: String, default: '' },
      accountNumber: { type: String, default: '' },
      businessNumber: { type: String, default: '' },
      tillNumber: { type: String, default: '' },
      transactionCode: { type: String, default: '' },
      stripeSessionId: { type: String, default: '' },
      paypalOrderId: { type: String, default: '' },
      mpesaCheckoutRequestId: { type: String, default: '' },
      mpesaReceiptNumber: { type: String, default: '' }
    },
    paymentConfirmed: {
      type: Boolean,
      default: false
    },
    confirmationMethod: {
      type: String,
      enum: ['auto_stripe', 'auto_mpesa_callback', 'auto_paypal', 'manual', 'pending'],
      default: 'pending'
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'expired'],
      default: 'pending'
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminUser',
      default: null
    },
    reviewedAt: {
      type: Date,
      default: null
    },
    rejectionReason: {
      type: String,
      default: ''
    },
    submittedAt: {
      type: Date,
      default: Date.now
    },
    expiresAt: {
      type: Date,
      required: true
    },
    licenseKeyGenerated: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

pendingActivationSchema.methods.isExpired = function () {
  return new Date() > this.expiresAt;
};

pendingActivationSchema.methods.approve = async function (adminId) {
  this.status = 'approved';
  this.reviewedBy = adminId;
  this.reviewedAt = new Date();
  return this.save();
};

pendingActivationSchema.methods.reject = async function (adminId, reason) {
  this.status = 'rejected';
  this.reviewedBy = adminId;
  this.reviewedAt = new Date();
  this.rejectionReason = reason;
  return this.save();
};

pendingActivationSchema.methods.markExpired = async function () {
  this.status = 'expired';
  return this.save();
};

const PendingActivation = mongoose.model('PendingActivation', pendingActivationSchema);

export default PendingActivation;