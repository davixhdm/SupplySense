import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'ClientOrg', required: true },
    sku: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    category: { type: String, default: '', trim: true },
    unit: { type: String, default: 'piece', trim: true },
    stockLevel: { type: Number, default: 0, min: 0 },
    reorderThreshold: { type: Number, default: 0, min: 0 },
    unitCost: { type: Number, default: 0, min: 0 },
    sellingPrice: { type: Number, default: 0, min: 0 },
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', default: null },
    location: { type: String, default: '', trim: true },
    warehouse: { type: String, default: '', trim: true },
    barcode: { type: String, default: '', trim: true },
    image: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    lastStockUpdate: { type: Date, default: Date.now },
    source: { type: String, default: 'manual' },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

productSchema.index({ organizationId: 1, sku: 1 }, { unique: true });
productSchema.index({ organizationId: 1, category: 1 });
productSchema.index({ stockLevel: 1 });

productSchema.methods.isLowStock = function () { return this.stockLevel <= this.reorderThreshold; };

productSchema.methods.adjustStock = async function (quantity, type) {
  if (type === 'increase') this.stockLevel += quantity;
  else if (type === 'decrease') this.stockLevel = Math.max(0, this.stockLevel - quantity);
  this.lastStockUpdate = new Date();
  return this.save();
};

const Product = mongoose.model('Product', productSchema);
export default Product;