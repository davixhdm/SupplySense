const currencyConfig = {
  KSh: {
    symbol: 'KSh',
    locale: 'en-KE',
    currency: 'KES',
    decimalPlaces: 2
  },
  USD: {
    symbol: '$',
    locale: 'en-US',
    currency: 'USD',
    decimalPlaces: 2
  },
  EUR: {
    symbol: '€',
    locale: 'de-DE',
    currency: 'EUR',
    decimalPlaces: 2
  },
  GBP: {
    symbol: '£',
    locale: 'en-GB',
    currency: 'GBP',
    decimalPlaces: 2
  }
};

const formatAmount = (amount, currencyCode = 'KSh') => {
  const config = currencyConfig[currencyCode] || currencyConfig.KSh;
  
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.currency,
    minimumFractionDigits: config.decimalPlaces,
    maximumFractionDigits: config.decimalPlaces
  }).format(amount);
};

const formatAmountWithoutSymbol = (amount, currencyCode = 'KSh') => {
  const config = currencyConfig[currencyCode] || currencyConfig.KSh;
  
  return new Intl.NumberFormat(config.locale, {
    style: 'decimal',
    minimumFractionDigits: config.decimalPlaces,
    maximumFractionDigits: config.decimalPlaces
  }).format(amount);
};

const getCurrencySymbol = (currencyCode = 'KSh') => {
  const config = currencyConfig[currencyCode];
  return config ? config.symbol : 'KSh';
};

const convertCurrency = (amount, fromCurrency, toCurrency, rates) => {
  if (fromCurrency === toCurrency) return amount;
  if (!rates || !rates[fromCurrency] || !rates[toCurrency]) return amount;
  
  const baseAmount = amount / rates[fromCurrency];
  return baseAmount * rates[toCurrency];
};

export {
  formatAmount,
  formatAmountWithoutSymbol,
  getCurrencySymbol,
  convertCurrency,
  currencyConfig
};