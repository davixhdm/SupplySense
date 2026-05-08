import { apiFetch } from './api'
import { InventoryItem, PaginatedResponse } from './types'

export const inventoryService = {
  getInventory: (page = 1, limit = 20) =>
    apiFetch<PaginatedResponse<InventoryItem>>(
      `/inventory?page=${page}&limit=${limit}`
    ),
  getItem: (id: string) => apiFetch<InventoryItem>(`/inventory/${id}`),
  createItem: (data: Partial<InventoryItem>) =>
    apiFetch<InventoryItem>('/inventory', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateItem: (id: string, data: Partial<InventoryItem>) =>
    apiFetch<InventoryItem>(`/inventory/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteItem: (id: string) => apiFetch(`/inventory/${id}`, { method: 'DELETE' }),
}
