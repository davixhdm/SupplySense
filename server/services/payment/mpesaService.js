import axios from 'axios';
import env from '../../config/env.js';

const getAuthToken = async () => {
  const auth = Buffer.from(`${env.MPESA_CONSUMER_KEY}:${env.MPESA_CONSUMER_SECRET}`).toString('base64');
  const response = await axios.get(
    `https://${env.MPESA_ENVIRONMENT === 'live' ? 'api' : 'sandbox'}.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials`,
    { headers: { Authorization: `Basic ${auth}` } }
  );
  return response.data.access_token;
};

export const initiateSTKPush = async ({ phoneNumber, amount, accountReference, transactionDesc }) => {
  const token = await getAuthToken();
  const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
  const password = Buffer.from(`${env.MPESA_SHORTCODE}${env.MPESA_PASSKEY}${timestamp}`).toString('base64');

  const response = await axios.post(
    `https://${env.MPESA_ENVIRONMENT === 'live' ? 'api' : 'sandbox'}.safaricom.co.ke/mpesa/stkpush/v1/processrequest`,
    {
      BusinessShortCode: env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(amount),
      PartyA: phoneNumber,
      PartyB: env.MPESA_SHORTCODE,
      PhoneNumber: phoneNumber,
      CallBackURL: `${env.CLIENT_APP_URL}/api/payment/mpesa/callback`,
      AccountReference: accountReference,
      TransactionDesc: transactionDesc || 'SupplySense Payment'
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return response.data;
};

export const querySTKStatus = async (checkoutRequestId) => {
  const token = await getAuthToken();
  const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
  const password = Buffer.from(`${env.MPESA_SHORTCODE}${env.MPESA_PASSKEY}${timestamp}`).toString('base64');

  const response = await axios.post(
    `https://${env.MPESA_ENVIRONMENT === 'live' ? 'api' : 'sandbox'}.safaricom.co.ke/mpesa/stkpushquery/v1/query`,
    {
      BusinessShortCode: env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return response.data;
};

export const verifyTransaction = async ({ transactionCode, amount, phoneNumber }) => {
  const token = await getAuthToken();
  const response = await axios.post(
    `https://${env.MPESA_ENVIRONMENT === 'live' ? 'api' : 'sandbox'}.safaricom.co.ke/mpesa/transactionstatus/v1/query`,
    {
      Initiator: 'testapi',
      SecurityCredential: 'dummy',
      CommandID: 'TransactionStatusQuery',
      TransactionID: transactionCode,
      PartyA: env.MPESA_SHORTCODE,
      IdentifierType: '4',
      ResultURL: `${env.CLIENT_APP_URL}/api/payment/mpesa/result`,
      QueueTimeOutURL: `${env.CLIENT_APP_URL}/api/payment/mpesa/timeout`,
      Remarks: 'Verification',
      Occasion: 'Payment verification'
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};