import { apiFetch } from './api'
import { Order, PaginatedResponse } from './types'

export const orderService = {
  getOrders: (page = 1, limit = 20) =>
    apiFetch<PaginatedResponse<Order>>(`/orders?page=${page}&limit=${limit}`),
  getOrderStats: () => apiFetch<any>('/orders/stats'),
  getOrder: (id: string) => apiFetch<Order>(`/orders/${id}`),
  createOrder: (data: Partial<Order>) =>
    apiFetch<Order>('/orders', { method: 'POST', body: JSON.stringify(data) }),
  updateOrder: (id: string, data: Partial<Order>) =>
    apiFetch<Order>(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  updateOrderStatus: (id: string, status: string) =>
    apiFetch<Order>(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
}
