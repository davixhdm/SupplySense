import mongoose from 'mongoose';

const clientOrgSchema = new mongoose.Schema(
  {
    organizationName: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: '' },
    industry: { type: String, enum: ['ecommerce', 'manufacturing', 'agro-supply', 'retail', 'wholesale', 'other'], default: 'other' },
    logo: { type: String, default: '' },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      country: { type: String, default: '' },
      postalCode: { type: String, default: '' }
    },
    timezone: { type: String, default: 'Africa/Nairobi' },
    language: { type: String, default: 'en' },
    mode: { type: String, enum: ['standalone', 'erp'], default: 'standalone' },
    plan: { type: String, enum: ['trial', 'standard', 'proplus'], default: 'trial' },
    billingCycle: { type: String, enum: ['monthly', 'yearly', 'permanent', 'trial'], default: 'trial' },
    planStartDate: { type: Date, default: Date.now },
    planEndDate: { type: Date, default: null },
    trialEndDate: { type: Date, default: null },
    licenseKey: { type: String, default: null },
    isActive: { type: Boolean, default: true },
    isSuspended: { type: Boolean, default: false },
    suspendedReason: { type: String, default: '' },
    suspendedAt: { type: Date, default: null },
    erpConnections: [{
      type: { type: String, enum: ['odoo', 'zoho', 'sap', 'dynamics', 'shopify', 'woocommerce', 'hdm', 'smartpos', 'custom', 'csv'] },
      name: String,
      url: String,
      apiKey: String,
      username: String,
      password: String,
      database: String,
      consumerKey: String,
      consumerSecret: String,
      isActive: { type: Boolean, default: true },
      lastSync: { type: Date, default: null },
      syncInterval: { type: String, enum: ['realtime', 'hourly', 'daily', 'manual'], default: 'hourly' }
    }],
    settings: {
      currency: { type: String, enum: ['KSh', 'USD', 'EUR', 'GBP'], default: 'KSh' },
      dateFormat: { type: String, default: 'DD/MM/YYYY' },
      notificationChannels: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
        whatsapp: { type: Boolean, default: false }
      }
    },
    enabledModules: {
      dashboard: { type: Boolean, default: true },
      transactions: { type: Boolean, default: true },
      orders: { type: Boolean, default: true },
      inventory: { type: Boolean, default: true },
      suppliers: { type: Boolean, default: true },
      customers: { type: Boolean, default: true },
      employees: { type: Boolean, default: true },
      aiInsights: { type: Boolean, default: true },
      alerts: { type: Boolean, default: true },
      settings: { type: Boolean, default: true }
    },
    backupSchedule: {
      enabled: { type: Boolean, default: false },
      frequency: { type: String, enum: ['hourly', 'daily', 'weekly', 'monthly'], default: 'daily' },
      time: { type: String, default: '02:00' },
      email: { type: String, default: '' },
      sendOnBackup: { type: Boolean, default: false }
    },
    maxUsers: { type: Number, default: 1 },
    maxProducts: { type: Number, default: 50 },
    maxSuppliers: { type: Number, default: 10 },
    subscriptionId: { type: String, default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser', default: null }
  },
  { timestamps: true }
);

clientOrgSchema.pre('save', async function (next) {
  if (this.isModified('organizationName') || !this.slug) {
    let baseSlug = this.organizationName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    let slug = baseSlug;
    let count = 0;
    while (await mongoose.model('ClientOrg').findOne({ slug, _id: { $ne: this._id } })) {
      count++;
      slug = `${baseSlug}-${count}`;
    }
    this.slug = slug;
  }
  next();
});

clientOrgSchema.methods.isPlanExpired = function () {
  if (this.billingCycle === 'permanent') return false;
  if (!this.planEndDate) return false;
  return new Date() > this.planEndDate;
};

clientOrgSchema.methods.isTrialExpired = function () {
  if (!this.trialEndDate) return false;
  return new Date() > this.trialEndDate;
};

const ClientOrg = mongoose.model('ClientOrg', clientOrgSchema);

export default ClientOrg;