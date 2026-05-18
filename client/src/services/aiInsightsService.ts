import { apiFetch } from './api'
import { Insight, Prediction } from './types'

export const aiInsightsService = {
  getInsights: () => apiFetch<Insight[]>('/ai-insights'),
  searchInsights: (query: string, category?: string) =>
    apiFetch<Insight[]>(
      `/ai-insights/search?query=${query}${category ? `&category=${category}` : ''}`
    ),
  getPrediction: (input: any) =>
    apiFetch<Prediction>('/ai-insights/prediction', {
      method: 'POST',
      body: JSON.stringify(input),
    }),
}
