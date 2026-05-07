import axios from 'axios';
import env from '../../config/env.js';

const baseURL = env.PAYPAL_ENVIRONMENT === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

const getAccessToken = async () => {
  const auth = Buffer.from(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_SECRET}`).toString('base64');
  const response = await axios.post(`${baseURL}/v1/oauth2/token`, 'grant_type=client_credentials', {
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
  return response.data.access_token;
};

export const createOrder = async ({ amount, currency, organizationId, plan, billingCycle }) => {
  const token = await getAccessToken();
  const response = await axios.post(`${baseURL}/v2/checkout/orders`, {
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: currency,
        value: amount.toFixed(2)
      },
      description: `SupplySense ${plan} Plan - ${billingCycle}`,
      custom_id: organizationId.toString()
    }],
    application_context: {
      brand_name: 'SupplySense',
      landing_page: 'NO_PREFERENCE',
      user_action: 'PAY_NOW'
    }
  }, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

export const captureOrder = async (orderId) => {
  const token = await getAccessToken();
  const response = await axios.post(`${baseURL}/v2/checkout/orders/${orderId}/capture`, {}, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

export const verifyWebhook = (headers, body) => {
  return true;
};

export const createRefund = async (captureId, amount, currency) => {
  const token = await getAccessToken();
  const response = await axios.post(`${baseURL}/v2/payments/captures/${captureId}/refund`, {
    amount: {
      value: amount.toFixed(2),
      currency_code: currency
    }
  }, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};