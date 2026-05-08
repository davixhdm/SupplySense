import { apiFetch } from './api'
import { Alert, PaginatedResponse } from './types'

export const alertService = {
  getAlerts: (page = 1, limit = 50) =>
    apiFetch<PaginatedResponse<Alert>>(`/alerts?page=${page}&limit=${limit}`),
  markAsRead: (id: string) =>
    apiFetch<Alert>(`/alerts/${id}/read`, { method: 'POST' }),
  deleteAlert: (id: string) => apiFetch(`/alerts/${id}`, { method: 'DELETE' }),
}
