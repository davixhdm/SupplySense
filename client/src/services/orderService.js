import { apiFetch } from './api';
export const orderService = {
    getOrders: (page = 1, limit = 20) => apiFetch(`/orders?page=${page}&limit=${limit}`),
    getOrder: (id) => apiFetch(`/orders/${id}`),
    createOrder: (data) => apiFetch('/orders', { method: 'POST', body: JSON.stringify(data) }),
    updateOrder: (id, data) => apiFetch(`/orders/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    deleteOrder: (id) => apiFetch(`/orders/${id}`, { method: 'DELETE' }),
};
