import { apiFetch } from './api'

export const customerService = {
  getCustomers: () => apiFetch('/customers'),
  getCustomer: (id: string) => apiFetch(`/customers/${id}`),
  createCustomer: (data: any) =>
    apiFetch('/customers', { method: 'POST', body: JSON.stringify(data) }),
  updateCustomer: (id: string, data: any) =>
    apiFetch(`/customers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCustomer: (id: string) =>
    apiFetch(`/customers/${id}`, { method: 'DELETE' }),
}
