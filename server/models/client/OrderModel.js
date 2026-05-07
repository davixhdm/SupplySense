import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClientOrg',
      required: true
    },
    orderNumber: {
      type: String,
      required: true,
      unique: true
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      enum: ['KSh', 'USD', 'EUR', 'GBP'],
      default: 'KSh'
    },
    status: {
      type: String,
      enum: ['placed', 'confirmed', 'shipped', 'in_transit', 'delivered', 'cancelled', 'returned'],
      default: 'placed'
    },
    trackingNumber: {
      type: String,
      default: ''
    },
    expectedDeliveryDate: {
      type: Date,
      default: null
    },
    actualDeliveryDate: {
      type: Date,
      default: null
    },
    deliveryNotes: {
      type: String,
      default: ''
    },
    isDelayed: {
      type: Boolean,
      default: false
    },
    delayDays: {
      type: Number,
      default: 0
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClientUser',
      required: true
    },
    statusHistory: [
      {
        status: String,
        changedAt: { type: Date, default: Date.now },
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'ClientUser' },
        notes: { type: String, default: '' }
      }
    ],
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  { timestamps: true }
);

orderSchema.index({ organizationId: 1, status: 1 });
orderSchema.index({ organizationId: 1, supplierId: 1 });
orderSchema.index({ organizationId: 1, productId: 1 });

orderSchema.pre('save', async function (next) {
  if (this.isNew) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.orderNumber = `ORD-${timestamp}-${random}`;
    this.statusHistory.push({
      status: this.status,
      changedBy: this.createdBy,
      notes: 'Order created'
    });
  }
  next();
});

orderSchema.methods.updateStatus = async function (newStatus, userId, notes = '') {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    changedAt: new Date(),
    changedBy: userId,
    notes
  });

  if (newStatus === 'delivered') {
    this.actualDeliveryDate = new Date();
    if (this.expectedDeliveryDate && new Date() > this.expectedDeliveryDate) {
      this.isDelayed = true;
      this.delayDays = Math.ceil(
        (new Date() - this.expectedDeliveryDate) / (1000 * 60 * 60 * 24)
      );
    }
  }

  return this.save();
};

const Order = mongoose.model('Order', orderSchema);

export default Order;