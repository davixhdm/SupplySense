import dotenv from 'dotenv';
dotenv.config();

const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
  BREVO_API_KEY: process.env.BREVO_API_KEY,
  BREVO_SENDER_EMAIL: process.env.BREVO_SENDER_EMAIL,
  BREVO_SENDER_NAME: process.env.BREVO_SENDER_NAME,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  MPESA_CONSUMER_KEY: process.env.MPESA_CONSUMER_KEY,
  MPESA_CONSUMER_SECRET: process.env.MPESA_CONSUMER_SECRET,
  MPESA_PASSKEY: process.env.MPESA_PASSKEY,
  MPESA_SHORTCODE: process.env.MPESA_SHORTCODE,
  MPESA_ENVIRONMENT: process.env.MPESA_ENVIRONMENT || 'sandbox',
  PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
  PAYPAL_SECRET: process.env.PAYPAL_SECRET,
  PAYPAL_ENVIRONMENT: process.env.PAYPAL_ENVIRONMENT || 'sandbox',
  AI_ENGINE_URL: process.env.AI_ENGINE_URL || 'http://localhost:8000',
  AI_ENGINE_API_KEY: process.env.AI_ENGINE_API_KEY,
  CLIENT_APP_URL: process.env.CLIENT_APP_URL || 'http://localhost:3000',
  ADMIN_APP_URL: process.env.ADMIN_APP_URL || 'http://localhost:3001',
  LICENSE_KEY_PREFIX: process.env.LICENSE_KEY_PREFIX || 'SSS',
  TRIAL_DURATION_DAYS: process.env.TRIAL_DURATION_DAYS || 14,
  DEFAULT_CURRENCY: process.env.DEFAULT_CURRENCY || 'KSh',
  ADMIN_INVITE_CODE: process.env.ADMIN_INVITE_CODE,
  BASE_URL: process.env.BASE_URL || 'http://localhost:5000'
};

const requiredVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'ENCRYPTION_KEY',
  'BREVO_API_KEY',
  'BREVO_SENDER_EMAIL'
];

for (const variable of requiredVars) {
  if (!env[variable]) {
    console.error(`\x1b[31mMissing required environment variable: ${variable}\x1b[0m`);
    process.exit(1);
  }
}

export default env;