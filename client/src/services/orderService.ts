import { apiFetch } from './api'

export const orderService = {
  getOrders: () => apiFetch('/orders'),
  getOrder: (id: string) => apiFetch(`/orders/${id}`),
  createOrder: (data: any) =>
    apiFetch('/orders', { method: 'POST', body: JSON.stringify(data) }),
  updateOrder: (id: string, data: any) =>
    apiFetch(`/orders/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteOrder: (id: string) =>
    apiFetch(`/orders/${id}`, { method: 'DELETE' }),
}
