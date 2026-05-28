import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
  {
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'ClientOrg', required: true },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true, default: '' },
    phone: { type: String, default: '' },
    address: {
      street: { type: String, default: '' }, city: { type: String, default: '' },
      state: { type: String, default: '' }, country: { type: String, default: '' }, postalCode: { type: String, default: '' }
    },
    customerType: { type: String, enum: ['individual', 'business', 'wholesale', 'vip'], default: 'individual' },
    totalPurchases: { type: Number, default: 0, min: 0 },
    totalSpent: { type: Number, default: 0, min: 0 },
    purchaseCount: { type: Number, default: 0, min: 0 },
    lastPurchaseDate: { type: Date, default: null },
    firstPurchaseDate: { type: Date, default: null },
    walkInFrequency: { type: Number, default: 0 },
    loyaltyCardNumber: { type: String, default: '' },
    loyaltyPoints: { type: Number, default: 0, min: 0 },
    visitCount: { type: Number, default: 0, min: 0 },
    churnRisk: { type: Number, default: 0, min: 0, max: 100 },
    lifetimeValue: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
    tags: [{ type: String, trim: true }],
    notes: { type: String, default: '', trim: true },
    source: { type: String, default: 'manual' },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

customerSchema.index({ organizationId: 1, email: 1 });
customerSchema.index({ organizationId: 1, phone: 1 });
customerSchema.index({ organizationId: 1, churnRisk: -1 });

customerSchema.methods.recordPurchase = async function (amount) {
  this.purchaseCount += 1; this.totalSpent += amount; this.totalPurchases += amount;
  const now = new Date(); if (!this.firstPurchaseDate) this.firstPurchaseDate = now;
  this.lastPurchaseDate = now; return this.save();
};

customerSchema.methods.calculateLifetimeValue = async function () {
  if (this.purchaseCount === 0) return 0;
  const avgOrderValue = this.totalSpent / this.purchaseCount;
  this.lifetimeValue = avgOrderValue * (this.purchaseCount || 1) * 1.5;
  return this.save();
};

customerSchema.methods.calculateChurnRisk = async function () {
  if (!this.lastPurchaseDate) { this.churnRisk = 100; return this.save(); }
  const daysSinceLastPurchase = Math.ceil((new Date() - this.lastPurchaseDate) / (1000 * 60 * 60 * 24));
  if (daysSinceLastPurchase > 180) this.churnRisk = 90;
  else if (daysSinceLastPurchase > 90) this.churnRisk = 60;
  else if (daysSinceLastPurchase > 30) this.churnRisk = 30;
  else this.churnRisk = Math.max(0, Math.floor(daysSinceLastPurchase / 3));
  return this.save();
};

const Customer = mongoose.model('Customer', customerSchema);
export default Customer;