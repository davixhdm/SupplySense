import { apiFetch } from './api'

export const aiInsightsService = {
  getInsights: () => apiFetch('/ai/insights'),
  getPrediction: (input: any) =>
    apiFetch('/ai/predict', { method: 'POST', body: JSON.stringify(input) }),
}
