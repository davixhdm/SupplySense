import mongoose from 'mongoose';

const systemSettingsSchema = new mongoose.Schema(
  {
    systemName: { type: String, default: 'SupplySense' },
    licenseKeyPrefix: { type: String, default: 'SSS' },
    trialDuration: { type: Number, default: 14 },
    clientAppUrl: { type: String, default: '' },
    adminAppUrl: { type: String, default: '' },
    brevoSender: { type: String, default: '' },
    general: {
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      address: { type: String, default: '' },
      aboutContent: { type: String, default: '' },
      heroTitle: { type: String, default: 'Intelligent Supply Chain Management' },
      heroSubtitle: { type: String, default: 'Predict, monitor, and optimize your supply chain with AI-powered insights.' }
    },
    footer: {
      copyright: { type: String, default: 'SupplySense Systems' },
      columns: [{ title: String, links: [{ label: String, url: String, scrollTo: String }] }]
    },
    legal: {
      terms: { type: String, default: '' },
      privacy: { type: String, default: '' },
      cookies: { type: String, default: '' }
    },
    paymentConfig: {
      stripeEnabled: { type: Boolean, default: false },
      mpesaEnabled: { type: Boolean, default: false },
      paypalEnabled: { type: Boolean, default: false },
      mpesaSubMethods: {
        stkPush: { type: Boolean, default: false },
        sendMoney: { type: Boolean, default: false },
        paybill: { type: Boolean, default: false },
        till: { type: Boolean, default: false }
      },
      mpesaNumbers: {
        sendMoneyPhone: { type: String, default: '' },
        paybillBusinessNumber: { type: String, default: '' },
        paybillAccountName: { type: String, default: '' },
        tillNumber: { type: String, default: '' },
        tillBusinessName: { type: String, default: '' }
      },
      currency: { type: String, enum: ['KSh', 'USD', 'EUR', 'GBP'], default: 'KSh' }
    },
    pricing: {
      trial: { duration: { type: Number, default: 14 } },
      standard: { monthly: { type: Number, default: 0 }, yearly: { type: Number, default: 0 }, permanent: { type: Number, default: 0 } },
      proplus: { monthly: { type: Number, default: 0 }, yearly: { type: Number, default: 0 }, permanent: { type: Number, default: 0 } }
    },
    aiConfig: {
      baseUrl: { type: String, default: 'https://supplysense-ai-engine.onrender.com' },
      apiKey: { type: String, default: 'supplysense449840e02cf67e93' },
      landingChatEnabled: { type: Boolean, default: true },
      chatbotTitle: { type: String, default: 'SupplySense Assistant' },
      chatbotColor: { type: String, default: '#2563eb' }
    },
    backupSchedule: {
      enabled: { type: Boolean, default: false },
      frequency: { type: String, enum: ['hourly', 'daily', 'weekly', 'monthly'], default: 'daily' },
      time: { type: String, default: '02:00' },
      email: { type: String, default: '' },
      sendOnBackup: { type: Boolean, default: false }
    }
  },
  { timestamps: true, collection: 'systemsettings' }
);

systemSettingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) settings = await this.create({});
  return settings;
};

const SystemSettings = mongoose.model('SystemSettings', systemSettingsSchema);
export default SystemSettings;