import { apiFetch } from './api';
export const customerService = {
    getCustomers: (page = 1, limit = 20) => apiFetch(`/customers?page=${page}&limit=${limit}`),
    getCustomer: (id) => apiFetch(`/customers/${id}`),
    createCustomer: (data) => apiFetch('/customers', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    updateCustomer: (id, data) => apiFetch(`/customers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    deleteCustomer: (id) => apiFetch(`/customers/${id}`, { method: 'DELETE' }),
};
