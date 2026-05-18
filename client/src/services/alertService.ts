import { apiFetch } from './api'
import { Alert, PaginatedResponse } from './types'

export const alertService = {
  getAlerts: (page = 1, limit = 50) =>
    apiFetch<PaginatedResponse<Alert>>(`/alerts?page=${page}&limit=${limit}`),
  getUnreadCount: () => apiFetch<{ count: number }>('/alerts/unread-count'),
  markAsRead: (id: string) =>
    apiFetch<Alert>(`/alerts/${id}/read`, { method: 'PUT' }),
  markAllAsRead: () =>
    apiFetch('/alerts/read-all', { method: 'PUT' }),
  markAsActioned: (id: string) =>
    apiFetch<Alert>(`/alerts/${id}/action`, { method: 'PUT' }),
  dismissAlert: (id: string) =>
    apiFetch<Alert>(`/alerts/${id}/dismiss`, { method: 'PUT' }),
}
