import mongoose from 'mongoose';

const systemSettingsSchema = new mongoose.Schema(
  {
    systemName: { type: String, default: 'SupplySense' },
    licenseKeyPrefix: { type: String, default: 'SSS' },
    trialDuration: { type: Number, default: 14 },
    clientAppUrl: { type: String, default: '' },
    adminAppUrl: { type: String, default: '' },
    brevoSender: { type: String, default: '' },
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
      currency: { type: String, enum: ['KSh', 'USD', 'EUR', 'GBP'], default: 'KSh' }
    },
    pricing: {
      trial: { duration: { type: Number, default: 14 } },
      standard: {
        monthly: { type: Number, default: 0 },
        yearly: { type: Number, default: 0 },
        permanent: { type: Number, default: 0 }
      },
      proplus: {
        monthly: { type: Number, default: 0 },
        yearly: { type: Number, default: 0 },
        permanent: { type: Number, default: 0 }
      }
    },
    backupSchedule: {
      enabled: { type: Boolean, default: false },
      frequency: { type: String, enum: ['hourly', 'daily', 'weekly', 'monthly'], default: 'daily' },
      time: { type: String, default: '02:00' },
      email: { type: String, default: '' }
    }
  },
  { timestamps: true, collection: 'systemsettings' }
);

systemSettingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const SystemSettings = mongoose.model('SystemSettings', systemSettingsSchema);

export default SystemSettings;