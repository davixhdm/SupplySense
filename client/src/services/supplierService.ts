import { apiFetch } from './api'
import { Supplier, PaginatedResponse } from './types'

export const supplierService = {
  getSuppliers: (page = 1, limit = 20) =>
    apiFetch<PaginatedResponse<Supplier>>(
      `/suppliers?page=${page}&limit=${limit}`
    ),
  getSupplierPerformance: () =>
    apiFetch<any>('/suppliers/performance'),
  getSupplier: (id: string) => apiFetch<Supplier>(`/suppliers/${id}`),
  createSupplier: (data: Partial<Supplier>) =>
    apiFetch<Supplier>('/suppliers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateSupplier: (id: string, data: Partial<Supplier>) =>
    apiFetch<Supplier>(`/suppliers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteSupplier: (id: string) =>
    apiFetch(`/suppliers/${id}`, { method: 'DELETE' }),
}
