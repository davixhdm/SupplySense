import axios from 'axios';
import env from '../config/env.js';

const aiClient = axios.create({
  baseURL: env.AI_ENGINE_URL,
  timeout: 120000,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': env.AI_ENGINE_API_KEY
  }
});

export const predictStockout = async (productData) => {
  const response = await aiClient.post('/api/forecast/stockout', productData);
  return response.data;
};

export const predictDemand = async (historicalData) => {
  const response = await aiClient.post('/api/forecast/demand', historicalData);
  return response.data;
};

export const detectAnomalies = async (transactionData) => {
  const response = await aiClient.post('/api/anomaly/detect', transactionData);
  return response.data;
};

export const scoreSupplier = async (supplierData) => {
  const response = await aiClient.post('/api/supplier/score', supplierData);
  return response.data;
};

export const predictCustomerChurn = async (customerData) => {
  const response = await aiClient.post('/api/customer/churn', customerData);
  return response.data;
};

export const getRecommendations = async (context) => {
  const response = await aiClient.post('/api/recommendations', context);
  return response.data;
};

export const generateInsights = async (query) => {
  const response = await aiClient.post('/api/insights', query);
  return response.data;
};

export const checkAIHealth = async () => {
  const response = await aiClient.get('/api/health');
  return response.data;
};