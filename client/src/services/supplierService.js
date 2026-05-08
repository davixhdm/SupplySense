import { apiFetch } from './api';
export const supplierService = {
    getSuppliers: (page = 1, limit = 20) => apiFetch(`/suppliers?page=${page}&limit=${limit}`),
    getSupplier: (id) => apiFetch(`/suppliers/${id}`),
    createSupplier: (data) => apiFetch('/suppliers', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    updateSupplier: (id, data) => apiFetch(`/suppliers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    deleteSupplier: (id) => apiFetch(`/suppliers/${id}`, { method: 'DELETE' }),
};
