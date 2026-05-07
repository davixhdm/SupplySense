const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const isValidPhone = (phone) => {
  const regex = /^\+?[1-9]\d{7,14}$/;
  return regex.test(phone);
};

const isValidMpesaPhone = (phone) => {
  const regex = /^2547\d{8}$/;
  return regex.test(phone);
};

const isValidLicenseKey = (key) => {
  const regex = /^SSS-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
  return regex.test(key);
};

const isValidObjectId = (id) => {
  const regex = /^[a-fA-F0-9]{24}$/;
  return regex.test(id);
};

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const isValidPassword = (password) => {
  return password && password.length >= 8;
};

const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>]/g, '').trim();
};

const isValidCurrency = (currency) => {
  const allowed = ['KSh', 'USD', 'EUR', 'GBP'];
  return allowed.includes(currency);
};

const isValidPlan = (plan) => {
  const allowed = ['trial', 'standard', 'proplus'];
  return allowed.includes(plan);
};

const isValidBillingCycle = (cycle) => {
  const allowed = ['monthly', 'yearly', 'permanent'];
  return allowed.includes(cycle);
};

export {
  isValidEmail,
  isValidPhone,
  isValidMpesaPhone,
  isValidLicenseKey,
  isValidObjectId,
  isValidUrl,
  isValidPassword,
  sanitizeString,
  isValidCurrency,
  isValidPlan,
  isValidBillingCycle
};