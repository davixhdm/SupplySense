import { apiFetch } from './api'
import { InventoryItem, PaginatedResponse } from './types'

export const inventoryService = {
  getInventory: (page = 1, limit = 20) =>
    apiFetch<PaginatedResponse<InventoryItem>>(
      `/inventory?page=${page}&limit=${limit}`
    ),
  getCategories: () => apiFetch<any>('/inventory/categories'),
  getLowStockProducts: () => apiFetch<InventoryItem[]>('/inventory/low-stock'),
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
  adjustStock: (id: string, quantity: number) =>
    apiFetch<InventoryItem>(`/inventory/${id}/stock`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    }),
  deleteItem: (id: string) =>
    apiFetch(`/inventory/${id}`, { method: 'DELETE' }),
}
