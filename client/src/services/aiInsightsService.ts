import { apiFetch } from './api'
import { Insight, Prediction } from './types'

export const aiInsightsService = {
  getInsights: () => apiFetch<Insight[]>('/ai/insights'),
  getPrediction: (input: any) =>
    apiFetch<Prediction>('/ai/predict', {
      method: 'POST',
      body: JSON.stringify(input),
    }),
}
