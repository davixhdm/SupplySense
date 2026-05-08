import { apiFetch } from './api'
import { AuthResponse, LicenseResponse, User } from './types'

export const authService = {
  login: (email: string, password: string) =>
    apiFetch<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (email: string, password: string, name: string) =>
    apiFetch<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    }),
  logout: () => apiFetch('/auth/logout', { method: 'POST' }),
  validateLicense: (licenseKey: string) =>
    apiFetch<LicenseResponse>('/auth/validate-license', {
      method: 'POST',
      body: JSON.stringify({ licenseKey }),
    }),
  getProfile: () => apiFetch<User>('/auth/profile'),
  updateProfile: (updates: Partial<User>) =>
    apiFetch<User>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
}
