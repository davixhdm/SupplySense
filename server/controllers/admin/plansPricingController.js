import SystemSettings from '../../models/admin/SystemSettingsModel.js';

const rates = {
  KSh: 1,
  USD: 0.0067,
  EUR: 0.0062,
  GBP: 0.0053
};

const toKSh = (amount, fromCurrency) => {
  if (fromCurrency === 'KSh') return amount;
  return Math.round(amount / rates[fromCurrency]);
};

const fromKSh = (amount, toCurrency) => {
  if (toCurrency === 'KSh') return amount;
  return Math.round(amount * rates[toCurrency] * 100) / 100;
};

const getPlansPricing = async (req, res) => {
  try {
    const settings = await SystemSettings.getSettings();
    const currency = settings.paymentConfig?.currency || 'KSh';
    const pricing = settings.pricing.toObject();

    return res.json({
      trial: { duration: pricing.trial.duration },
      standard: {
        monthly: fromKSh(pricing.standard.monthly, currency),
        yearly: fromKSh(pricing.standard.yearly, currency),
        permanent: fromKSh(pricing.standard.permanent, currency)
      },
      proplus: {
        monthly: fromKSh(pricing.proplus.monthly, currency),
        yearly: fromKSh(pricing.proplus.yearly, currency),
        permanent: fromKSh(pricing.proplus.permanent, currency)
      }
    });
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const updatePlansPricing = async (req, res) => {
  try {
    const settings = await SystemSettings.getSettings();
    const currency = settings.paymentConfig?.currency || 'KSh';

    if (req.body.pricing) {
      const incoming = req.body.pricing;
      settings.pricing = {
        trial: { duration: incoming.trial?.duration || settings.pricing.trial.duration },
        standard: {
          monthly: toKSh(incoming.standard?.monthly || settings.pricing.standard.monthly, currency),
          yearly: toKSh(incoming.standard?.yearly || settings.pricing.standard.yearly, currency),
          permanent: toKSh(incoming.standard?.permanent || settings.pricing.standard.permanent, currency)
        },
        proplus: {
          monthly: toKSh(incoming.proplus?.monthly || settings.pricing.proplus.monthly, currency),
          yearly: toKSh(incoming.proplus?.yearly || settings.pricing.proplus.yearly, currency),
          permanent: toKSh(incoming.proplus?.permanent || settings.pricing.proplus.permanent, currency)
        }
      };
    }

    if (req.body.paymentConfig) {
      if (req.body.paymentConfig.stripeEnabled !== undefined) settings.paymentConfig.stripeEnabled = req.body.paymentConfig.stripeEnabled;
      if (req.body.paymentConfig.mpesaEnabled !== undefined) settings.paymentConfig.mpesaEnabled = req.body.paymentConfig.mpesaEnabled;
      if (req.body.paymentConfig.paypalEnabled !== undefined) settings.paymentConfig.paypalEnabled = req.body.paymentConfig.paypalEnabled;
      if (req.body.paymentConfig.currency) settings.paymentConfig.currency = req.body.paymentConfig.currency;
      if (req.body.paymentConfig.mpesaSubMethods) {
        settings.paymentConfig.mpesaSubMethods = { ...settings.paymentConfig.mpesaSubMethods, ...req.body.paymentConfig.mpesaSubMethods };
      }
      if (req.body.paymentConfig.mpesaNumbers) {
        settings.paymentConfig.mpesaNumbers = { ...settings.paymentConfig.mpesaNumbers, ...req.body.paymentConfig.mpesaNumbers };
      }
    }

    settings.markModified('pricing');
    await settings.save();
    res.json(settings);
  } catch (error) {
    console.error('Update plans error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export { getPlansPricing, updatePlansPricing };