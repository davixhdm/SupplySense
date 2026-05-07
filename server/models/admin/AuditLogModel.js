import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClientOrg',
      default: null
    },
    action: {
      type: String,
      required: true
    },
    actionType: {
      type: String,
      enum: [
        'auth_login',
        'auth_logout',
        'auth_failed',
        'user_created',
        'user_updated',
        'user_deleted',
        'device_activated',
        'device_deactivated',
        'order_created',
        'order_updated',
        'order_deleted',
        'product_created',
        'product_updated',
        'product_deleted',
        'supplier_created',
        'supplier_updated',
        'supplier_deleted',
        'customer_created',
        'customer_updated',
        'customer_deleted',
        'transaction_created',
        'settings_updated',
        'license_generated',
        'license_revoked',
        'plan_changed',
        'payment_approved',
        'payment_rejected',
        'backup_created',
        'backup_restored',
        'admin_action',
        'system_event'
      ],
      required: true
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'performedByModel',
      default: null
    },
    performedByModel: {
      type: String,
      enum: ['AdminUser', 'ClientUser'],
      default: null
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    },
    targetModel: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      required: true
    },
    ipAddress: {
      type: String,
      default: ''
    },
    userAgent: {
      type: String,
      default: ''
    },
    deviceId: {
      type: String,
      default: ''
    },
    changes: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    previousValues: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    newValues: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    severity: {
      type: String,
      enum: ['info', 'warning', 'critical'],
      default: 'info'
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  { timestamps: true }
);

auditLogSchema.index({ organizationId: 1, createdAt: -1 });
auditLogSchema.index({ actionType: 1, createdAt: -1 });
auditLogSchema.index({ performedBy: 1 });
auditLogSchema.index({ severity: 1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;