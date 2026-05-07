import env from '../../config/env.js';

const getPaymentConfig = async (req, res) => {
  try {
    res.json({
      stripeEnabled: !!env.STRIPE_SECRET_KEY,
      mpesaEnabled: !!env.MPESA_CONSUMER_KEY,
      paypalEnabled: !!env.PAYPAL_CLIENT_ID,
      mpesaSubMethods: {
        stkPush: !!env.MPESA_PASSKEY,
        sendMoney: true,
        paybill: true,
        till: true
      },
      currency: env.DEFAULT_CURRENCY
    });
  } catch (error) {
    console.error('Get payment config error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export { getPaymentConfig };