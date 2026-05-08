import { apiFetch } from './api'
import { DashboardStats, Widget, Alert, Dashboard } from './types'

export const dashboardService = {
  getStats: () => apiFetch<DashboardStats>('/dashboard/stats'),
  getWidgets: () => apiFetch<Widget[]>('/dashboard/widgets'),
  getAlerts: () => apiFetch<Alert[]>('/dashboard/alerts'),
  getDashboard: () => apiFetch<Dashboard>('/dashboard'),
}
