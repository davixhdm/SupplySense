import { apiFetch } from './api'

export const inventoryService = {
  getInventory: () => apiFetch('/inventory'),
  getItem: (id: string) => apiFetch(`/inventory/${id}`),
  createItem: (data: any) =>
    apiFetch('/inventory', { method: 'POST', body: JSON.stringify(data) }),
  updateItem: (id: string, data: any) =>
    apiFetch(`/inventory/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteItem: (id: string) =>
    apiFetch(`/inventory/${id}`, { method: 'DELETE' }),
}
