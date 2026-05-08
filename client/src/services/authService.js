import { apiFetch } from './api';
export const authService = {
    login: (email, password) => apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    }),
    register: (email, password, name) => apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
    }),
    logout: () => apiFetch('/auth/logout', { method: 'POST' }),
    validateLicense: (licenseKey) => apiFetch('/auth/validate-license', {
        method: 'POST',
        body: JSON.stringify({ licenseKey }),
    }),
    getProfile: () => apiFetch('/auth/profile'),
    updateProfile: (updates) => apiFetch('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(updates),
    }),
};
