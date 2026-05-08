import { apiFetch } from './api'

export const supplierService = {
  getSuppliers: () => apiFetch('/suppliers'),
  getSupplier: (id: string) => apiFetch(`/suppliers/${id}`),
  createSupplier: (data: any) =>
    apiFetch('/suppliers', { method: 'POST', body: JSON.stringify(data) }),
  updateSupplier: (id: string, data: any) =>
    apiFetch(`/suppliers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteSupplier: (id: string) =>
    apiFetch(`/suppliers/${id}`, { method: 'DELETE' }),
}
