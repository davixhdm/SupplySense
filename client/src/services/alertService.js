import { apiFetch } from './api';
export const alertService = {
    getAlerts: (page = 1, limit = 50) => apiFetch(`/alerts?page=${page}&limit=${limit}`),
    markAsRead: (id) => apiFetch(`/alerts/${id}/read`, { method: 'POST' }),
    deleteAlert: (id) => apiFetch(`/alerts/${id}`, { method: 'DELETE' }),
};
