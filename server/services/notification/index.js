// server/services/notification/index.js
export {
  sendEmail,
  sendLicenseKeyEmail,
  sendPaymentConfirmationEmail,
  sendAlertEmail,
  sendPasswordResetEmail,
  sendDeviceVerificationEmail
} from './emailService.js';

export {
  sendSMS,
  sendLicenseKeySMS,
  sendPaymentConfirmationSMS,
  sendAlertSMS,
  sendDeviceOTPSMS
} from './smsService.js';