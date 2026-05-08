import { apiFetch } from './api';
export const dashboardService = {
    getStats: () => apiFetch('/dashboard/stats'),
    getWidgets: () => apiFetch('/dashboard/widgets'),
    getAlerts: () => apiFetch('/dashboard/alerts'),
    getDashboard: () => apiFetch('/dashboard'),
};
