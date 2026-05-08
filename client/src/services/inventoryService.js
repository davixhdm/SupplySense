import { apiFetch } from './api';
export const inventoryService = {
    getInventory: (page = 1, limit = 20) => apiFetch(`/inventory?page=${page}&limit=${limit}`),
    getItem: (id) => apiFetch(`/inventory/${id}`),
    createItem: (data) => apiFetch('/inventory', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    updateItem: (id, data) => apiFetch(`/inventory/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    deleteItem: (id) => apiFetch(`/inventory/${id}`, { method: 'DELETE' }),
};
