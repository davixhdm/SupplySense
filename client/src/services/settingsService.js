import { apiFetch } from './api';
export const settingsService = {
    // Company settings
    getCompanyInfo: () => apiFetch('/settings/company'),
    updateCompanyInfo: (data) => apiFetch('/settings/company', {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    // User preferences
    getPreferences: () => apiFetch('/settings/preferences'),
    updatePreferences: (data) => apiFetch('/settings/preferences', {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    // Devices
    getDevices: () => apiFetch('/settings/devices'),
    addDevice: (data) => apiFetch('/settings/devices', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    removeDevice: (id) => apiFetch(`/settings/devices/${id}`, { method: 'DELETE' }),
    // Backups
    getBackups: () => apiFetch('/settings/backups'),
    createBackup: () => apiFetch('/settings/backups', { method: 'POST' }),
    downloadBackup: (id) => apiFetch(`/settings/backups/${id}/download`),
    deleteBackup: (id) => apiFetch(`/settings/backups/${id}`, { method: 'DELETE' }),
    // Users management
    getUsers: () => apiFetch('/settings/users'),
    addUser: (data) => apiFetch('/settings/users', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    updateUser: (id, data) => apiFetch(`/settings/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    deleteUser: (id) => apiFetch(`/settings/users/${id}`, { method: 'DELETE' }),
};
