import { apiFetch } from './api'
import { CompanyInfo, UserSettings, Device, Backup, User } from './types'

export const settingsService = {
  // Company settings
  getCompanyInfo: () => apiFetch<CompanyInfo>('/settings/company'),
  updateCompanyInfo: (data: Partial<CompanyInfo>) =>
    apiFetch<CompanyInfo>('/settings/company', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // User preferences
  getPreferences: () => apiFetch<UserSettings>('/settings/preferences'),
  updatePreferences: (data: Partial<UserSettings>) =>
    apiFetch<UserSettings>('/settings/preferences', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Devices
  getDevices: () => apiFetch<Device[]>('/settings/devices'),
  addDevice: (data: Partial<Device>) =>
    apiFetch<Device>('/settings/devices', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  removeDevice: (id: string) =>
    apiFetch(`/settings/devices/${id}`, { method: 'DELETE' }),

  // Backups
  getBackups: () => apiFetch<Backup[]>('/settings/backups'),
  createBackup: () => apiFetch<Backup>('/settings/backups', { method: 'POST' }),
  downloadBackup: (id: string) =>
    apiFetch<Blob>(`/settings/backups/${id}/download`),
  deleteBackup: (id: string) =>
    apiFetch(`/settings/backups/${id}`, { method: 'DELETE' }),

  // Users management
  getUsers: () => apiFetch<User[]>('/settings/users'),
  addUser: (data: Partial<User>) =>
    apiFetch<User>('/settings/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateUser: (id: string, data: Partial<User>) =>
    apiFetch<User>(`/settings/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteUser: (id: string) =>
    apiFetch(`/settings/users/${id}`, { method: 'DELETE' }),
}
