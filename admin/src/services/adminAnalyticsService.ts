import api from './api'

export const adminAnalyticsService = {
  getPlatformAnalytics: async () => {
    const { data } = await api.get('/admin/analytics')
    return data
  }
}