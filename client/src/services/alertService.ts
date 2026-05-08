import { apiFetch } from './api'

export const alertService = {
  getAlerts: () => apiFetch('/alerts'),
  markAsRead: (id: string) =>
    apiFetch(`/alerts/${id}/read`, { method: 'POST' }),
  deleteAlert: (id: string) =>
    apiFetch(`/alerts/${id}`, { method: 'DELETE' }),
}
