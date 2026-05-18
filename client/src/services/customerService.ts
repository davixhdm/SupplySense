import { apiFetch } from './api'
import { Customer, PaginatedResponse } from './types'

export const customerService = {
  getCustomers: (page = 1, limit = 20) =>
    apiFetch<PaginatedResponse<Customer>>(
      `/customers?page=${page}&limit=${limit}`
    ),
  getCustomerStats: () => apiFetch<any>('/customers/stats'),
  getCustomer: (id: string) => apiFetch<Customer>(`/customers/${id}`),
  createCustomer: (data: Partial<Customer>) =>
    apiFetch<Customer>('/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateCustomer: (id: string, data: Partial<Customer>) =>
    apiFetch<Customer>(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteCustomer: (id: string) =>
    apiFetch(`/customers/${id}`, { method: 'DELETE' }),
}
