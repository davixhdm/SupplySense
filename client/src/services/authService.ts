import { apiFetch } from './api'

export const authService = {
  login: (email: string, password: string) =>
    apiFetch<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (email: string, password: string, name: string) =>
    apiFetch<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    }),
  logout: () => apiFetch('/auth/logout', { method: 'POST' }),
  validateLicense: (licenseKey: string) =>
    apiFetch<{ valid: boolean }>('/auth/validate-license', {
      method: 'POST',
      body: JSON.stringify({ licenseKey }),
    }),
  getProfile: () => apiFetch('/auth/profile'),
  updateProfile: (updates: any) =>
    apiFetch('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
}
