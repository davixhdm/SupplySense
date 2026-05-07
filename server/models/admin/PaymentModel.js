import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClientOrg',
      required: true
    },
    pendingActivationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PendingActivation',
      default: null
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
    paymentMethod: {
      type: String,
      enum: ['stripe', 'mpesa_stk', 'mpesa_send', 'mpesa_paybill', 'mpesa_till', 'paypal'],
      required: true
    },
    paymentProviderRef: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded', 'cancelled'],
      default: 'pending'
    },
    paymentConfirmedAt: {
      type: Date,
      default: null
    },
    refundedAt: {
      type: Date,
      default: null
    },
    refundAmount: {
      type: Number,
      default: 0
    },
    refundReason: {
      type: String,
      default: ''
    },
    receiptUrl: {
      type: String,
      default: ''
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  { timestamps: true }
);

paymentSchema.index({ organizationId: 1, createdAt: -1 });
paymentSchema.index({ paymentProviderRef: 1 });
paymentSchema.index({ status: 1 });

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;