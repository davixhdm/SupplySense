import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema(
  {
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'ClientOrg', required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: '' },
    contactPerson: { type: String, default: '', trim: true },
    address: { street: { type: String, default: '' }, city: { type: String, default: '' }, state: { type: String, default: '' }, country: { type: String, default: '' }, postalCode: { type: String, default: '' } },
    deliveryTimeline: { type: Number, default: 0, min: 0 },
    deliveryTimelineUnit: { type: String, enum: ['hours', 'days', 'weeks'], default: 'days' },
    paymentTerms: { type: String, default: '', trim: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalOrders: { type: Number, default: 0 },
    onTimeDeliveries: { type: Number, default: 0 },
    lateDeliveries: { type: Number, default: 0 },
    reliabilityScore: { type: Number, default: 0, min: 0, max: 100 },
    isActive: { type: Boolean, default: true },
    isPreferred: { type: Boolean, default: false },
    notes: { type: String, default: '', trim: true },
    source: { type: String, default: 'manual' },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

supplierSchema.index({ organizationId: 1, name: 1 });
supplierSchema.index({ organizationId: 1, reliabilityScore: -1 });

supplierSchema.methods.recordDelivery = async function (onTime) {
  this.totalOrders += 1;
  if (onTime) this.onTimeDeliveries += 1; else this.lateDeliveries += 1;
  await this.save();
  if (this.totalOrders === 0) return 0;
  this.reliabilityScore = Math.round((this.onTimeDeliveries / this.totalOrders) * 100);
  return this.save();
};

const Supplier = mongoose.model('Supplier', supplierSchema);
export default Supplier;