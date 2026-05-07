import { emailApi, brevoConfig } from '../../config/brevo.js';

export const sendEmail = async ({ to, subject, htmlContent, textContent = '' }) => {
  const sendSmtpEmail = {
    sender: brevoConfig.sender,
    to: [{ email: to }],
    subject,
    htmlContent,
    textContent
  };

  try {
    const response = await emailApi.sendTransacEmail(sendSmtpEmail);
    return { success: true, messageId: response.messageId };
  } catch (error) {
    console.error('Email send failed:', error.message);
    return { success: false, error: error.message };
  }
};

export const sendLicenseKeyEmail = async (to, { licenseKey, plan, billingCycle, expiryDate, fullName }) => {
  const planName = plan === 'standard' ? 'Standard' : 'Pro+';
  const htmlContent = `
    <h1>Welcome to SupplySense</h1>
    <p>Dear ${fullName},</p>
    <p>Your license key has been activated.</p>
    <p><strong>License Key:</strong> ${licenseKey}</p>
    <p><strong>Plan:</strong> ${planName}</p>
    <p><strong>Billing:</strong> ${billingCycle}</p>
    ${expiryDate ? `<p><strong>Expires:</strong> ${new Date(expiryDate).toLocaleDateString()}</p>` : '<p>Permanent license</p>'}
    <p>Keep this key safe. You will need it to activate your devices.</p>
  `;

  return sendEmail({
    to,
    subject: 'Your SupplySense License Key',
    htmlContent
  });
};

export const sendPaymentConfirmationEmail = async (to, { amount, currency, plan, billingCycle }) => {
  const htmlContent = `
    <h2>Payment Received</h2>
    <p>We have received your payment of ${currency} ${amount} for the ${plan} plan (${billingCycle}).</p>
    <p>Your license key will be sent within 24 hours after verification.</p>
  `;

  return sendEmail({
    to,
    subject: 'Payment Received - SupplySense',
    htmlContent
  });
};

export const sendAlertEmail = async (to, { title, message, alertType }) => {
  const htmlContent = `
    <h2>${title}</h2>
    <p>${message}</p>
    <p>Alert type: ${alertType}</p>
    <p>Log in to your dashboard for more details.</p>
  `;

  return sendEmail({
    to,
    subject: `[${alertType}] ${title}`,
    htmlContent
  });
};

export const sendPasswordResetEmail = async (to, resetUrl) => {
  const htmlContent = `
    <h2>Password Reset Request</h2>
    <p>Click the link below to reset your password:</p>
    <a href="${resetUrl}">${resetUrl}</a>
    <p>This link expires in 1 hour.</p>
    <p>If you did not request this, ignore this email.</p>
  `;

  return sendEmail({
    to,
    subject: 'Password Reset - SupplySense',
    htmlContent
  });
};

export const sendDeviceVerificationEmail = async (to, otp) => {
  const htmlContent = `
    <h2>Device Verification</h2>
    <p>Your verification code is: <strong>${otp}</strong></p>
    <p>Enter this code to verify your device.</p>
    <p>This code expires in 10 minutes.</p>
  `;

  return sendEmail({
    to,
    subject: 'Device Verification - SupplySense',
    htmlContent
  });
};