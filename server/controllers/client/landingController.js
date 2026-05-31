import axios from 'axios';
import env from '../../config/env.js';
import SystemSettings from '../../models/admin/SystemSettingsModel.js';

const chat = async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required.' });
    }

    const settings = await SystemSettings.getSettings();
    const pricing = settings.pricing || {};
    const currency = settings.paymentConfig?.currency || 'KSh';
    const symbol = currency === 'KSh' ? 'KSh' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£';

    const payload = {
      query: message,
      context: {
        features: [
          "Inventory Management — Track stock levels in real-time",
          "Sales Tracking — Monitor sales and revenue",
          "AI-Powered Insights — Get business recommendations",
          "Supplier Management — Score and manage suppliers",
          "Customer Management — Track customer spending and loyalty",
          "Demand Forecasting — Predict future stock needs",
          "Anomaly Detection — Flag unusual transactions",
          "ERP Integration — Connect HDM ERP, SmartPOS, Odoo, Shopify, WooCommerce",
          "Multi-currency Support — KES, USD, EUR, GBP",
          "Cloud Backups — Automatic data protection"
        ],
        pricing: {
          trial: `Free Trial: ${pricing.trial?.duration || 14} days, no credit card required`,
          standard: {
            monthly: `${symbol} ${pricing.standard?.monthly || 2900}/month`,
            yearly: `${symbol} ${pricing.standard?.yearly || 29000}/year`,
            permanent: `${symbol} ${pricing.standard?.permanent || 99000} one-time (lifetime)`
          },
          proplus: {
            monthly: `${symbol} ${pricing.proplus?.monthly || 7900}/month`,
            yearly: `${symbol} ${pricing.proplus?.yearly || 79000}/year`,
            permanent: `${symbol} ${pricing.proplus?.permanent || 249000} one-time (lifetime)`
          }
        },
        support: {
          email: "support@supplysense.com",
          phone: "+254 700 000 000",
          hours: "Monday - Friday, 8 AM - 6 PM EAT"
        }
      }
    };

    const { data } = await axios.post(`${env.AI_ENGINE_URL}/api/landing/chat`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.AI_ENGINE_API_KEY
      },
      timeout: 30000
    });

    res.json({ success: true, data });
  } catch (error) {
    console.error('Landing chat error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Chat service unavailable. Please try again later.' 
    });
  }
};

export { chat };