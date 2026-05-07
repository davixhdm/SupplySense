import { smsApi } from '../../config/brevo.js';

export const sendSMS = async ({ to, content }) => {
  const sendTransacSms = {
    sender: 'SupplySense',
    recipient: to.replace('+', ''),
    content
  };

  try {
    const response = await smsApi.sendTransacSms(sendTransacSms);
    return { success: true, messageId: response.messageId };
  } catch (error) {
    console.error('SMS send failed:', error.message);
    return { success: false, error: error.message };
  }
};

export const sendLicenseKeySMS = async (to, licenseKey) => {
  return sendSMS({
    to,
    content: `Your SupplySense license key: ${licenseKey}. Check email for details.`
  });
};

export const sendPaymentConfirmationSMS = async (to) => {
  return sendSMS({
    to,
    content: 'Payment received. Your license key will be sent within 24 hours after verification.'
  });
};

export const sendAlertSMS = async (to, title, message) => {
  return sendSMS({
    to,
    content: `[SupplySense Alert] ${title}: ${message.substring(0, 120)}`
  });
};

export const sendDeviceOTPSMS = async (to, otp) => {
  return sendSMS({
    to,
    content: `Your SupplySense device verification code: ${otp}. Expires in 10 minutes.`
  });
};