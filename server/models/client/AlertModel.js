import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClientOrg',
      required: true
    },
    alertType: {
      type: String,
      enum: [
        'low_stock',
        'stockout_predicted',
        'overstock',
        'order_delayed',
        'order_at_risk',
        'order_delivered',
        'supplier_performance_drop',
        'supplier_delay',
        'transaction_anomaly',
        'customer_churn_risk',
        'employee_performance',
        'system_notification'
      ],
      required: true
    },
    severity: {
      type: String,
      enum: ['info', 'warning', 'critical'],
      default: 'info'
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    },
    referenceModel: {
      type: String,
      enum: ['Product', 'Order', 'Supplier', 'Customer', 'Transaction', 'Employee', ''],
      default: ''
    },
    isRead: {
      type: Boolean,
      default: false
    },
    readAt: {
      type: Date,
      default: null
    },
    readBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClientUser',
      default: null
    },
    isActioned: {
      type: Boolean,
      default: false
    },
    actionedAt: {
      type: Date,
      default: null
    },
    actionTaken: {
      type: String,
      default: ''
    },
    isDismissed: {
      type: Boolean,
      default: false
    },
    dismissedAt: {
      type: Date,
      default: null
    },
    channels: {
      dashboard: { type: Boolean, default: true },
      email: { type: Boolean, default: false },
      sms: { type: Boolean, default: false },
      whatsapp: { type: Boolean, default: false }
    },
    emailSent: {
      type: Boolean,
      default: false
    },
    smsSent: {
      type: Boolean,
      default: false
    },
    whatsappSent: {
      type: Boolean,
      default: false
    },
    scheduledFor: {
      type: Date,
      default: null
    },
    expiresAt: {
      type: Date,
      default: null
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  { timestamps: true }
);

alertSchema.index({ organizationId: 1, isRead: 1, createdAt: -1 });
alertSchema.index({ organizationId: 1, severity: 1 });
alertSchema.index({ organizationId: 1, alertType: 1 });
alertSchema.index({ scheduledFor: 1 });

alertSchema.methods.markAsRead = async function (userId) {
  this.isRead = true;
  this.readAt = new Date();
  this.readBy = userId;
  return this.save();
};

alertSchema.methods.markAsActioned = async function (action) {
  this.isActioned = true;
  this.actionedAt = new Date();
  this.actionTaken = action;
  return this.save();
};

alertSchema.methods.dismiss = async function () {
  this.isDismissed = true;
  this.dismissedAt = new Date();
  return this.save();
};

const Alert = mongoose.model('Alert', alertSchema);

export default Alert;