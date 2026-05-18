import { apiFetch } from './api'
import { DashboardStats, Dashboard } from './types'

export const dashboardService = {
  getStats: () => apiFetch<DashboardStats>('/dashboard/stats'),
  getCharts: () => apiFetch<any>('/dashboard/charts'),
}
