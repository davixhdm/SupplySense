import { apiFetch } from './api'
import { AuthResponse, LicenseResponse, User } from './types'

export const authService = {
  // Registration & Login
  register: (data: any) =>
    apiFetch<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  login: (email: string, password: string) =>
    apiFetch<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  logout: () => apiFetch('/auth/logout', { method: 'POST' }),

  // License & Device Management
  activateLicense: (licenseKey: string) =>
    apiFetch<LicenseResponse>('/auth/activate-license', {
      method: 'POST',
      body: JSON.stringify({ licenseKey }),
    }),
  verifyDevice: (otp: string) =>
    apiFetch('/auth/verify-device', {
      method: 'POST',
      body: JSON.stringify({ otp }),
    }),
  sendDeviceOTP: () => apiFetch('/auth/send-device-otp', { method: 'POST' }),

  // Password Management
  forgotPassword: (email: string) =>
    apiFetch('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
  resetPassword: (token: string, password: string) =>
    apiFetch('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    }),
  changePassword: (oldPassword: string, newPassword: string) =>
    apiFetch('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ oldPassword, newPassword }),
    }),

  // Payment
  submitManualPayment: (data: any) =>
    apiFetch('/auth/manual-payment', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Profile
  getProfile: () => apiFetch<User>('/auth/profile'),
  updateProfile: (updates: Partial<User>) =>
    apiFetch<User>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
}
