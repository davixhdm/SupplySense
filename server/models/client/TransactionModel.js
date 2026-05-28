import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'ClientOrg', required: true },
    transactionNumber: { type: String, required: true, unique: true },
    type: { type: String, enum: ['sale', 'purchase', 'return', 'refund', 'expense', 'adjustment', 'transfer'], required: true },
    amount: { type: Number, required: true },
    currency: { type: String, enum: ['KSh', 'USD', 'EUR', 'GBP'], default: 'KSh' },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: null },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', default: null },
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', default: null },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null },
    quantity: { type: Number, default: 1, min: 1 },
    unitPrice: { type: Number, default: 0, min: 0 },
    paymentMethod: { type: String, enum: ['cash', 'card', 'mobile_money', 'bank_transfer', 'credit', 'other'], default: 'other' },
    status: { type: String, enum: ['pending', 'completed', 'failed', 'cancelled', 'disputed'], default: 'completed' },
    description: { type: String, default: '', trim: true },
    transactionDate: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'ClientUser', default: null },
    isAnomaly: { type: Boolean, default: false },
    anomalyScore: { type: Number, default: 0 },
    source: { type: String, default: 'manual' },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

transactionSchema.index({ organizationId: 1, transactionDate: -1 });
transactionSchema.index({ organizationId: 1, type: 1 });

transactionSchema.pre('validate', async function (next) {
  if (this.isNew) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.transactionNumber = `TXN-${timestamp}-${random}`;
  }
  next();
});

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;