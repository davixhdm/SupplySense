import { apiFetch } from './api'

export const settingsService = {
  getCompanyInfo: () => apiFetch('/settings/company'),
  updateCompanyInfo: (data: any) =>
    apiFetch('/settings/company', { method: 'PUT', body: JSON.stringify(data) }),
  getPreferences: () => apiFetch('/settings/preferences'),
  updatePreferences: (data: any) =>
    apiFetch('/settings/preferences', { method: 'PUT', body: JSON.stringify(data) }),
  getDevices: () => apiFetch('/settings/devices'),
  addDevice: (data: any) =>
    apiFetch('/settings/devices', { method: 'POST', body: JSON.stringify(data) }),
  removeDevice: (id: string) =>
    apiFetch(`/settings/devices/${id}`, { method: 'DELETE' }),
  getBackups: () => apiFetch('/settings/backups'),
  createBackup: () => apiFetch('/settings/backups', { method: 'POST' }),
  downloadBackup: (id: string) =>
    apiFetch(`/settings/backups/${id}/download`),
  deleteBackup: (id: string) =>
    apiFetch(`/settings/backups/${id}`, { method: 'DELETE' }),
  getUsers: () => apiFetch('/settings/users'),
  addUser: (data: any) =>
    apiFetch('/settings/users', { method: 'POST', body: JSON.stringify(data) }),
  updateUser: (id: string, data: any) =>
    apiFetch(`/settings/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteUser: (id: string) =>
    apiFetch(`/settings/users/${id}`, { method: 'DELETE' }),
}
