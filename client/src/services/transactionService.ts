import { apiFetch } from './api'
import { Transaction, PaginatedResponse } from './types'

export const transactionService = {
  getTransactions: (page = 1, limit = 20) =>
    apiFetch<PaginatedResponse<Transaction>>(
      `/transactions?page=${page}&limit=${limit}`
    ),
  getTransaction: (id: string) => apiFetch<Transaction>(`/transactions/${id}`),
  createTransaction: (data: Partial<Transaction>) =>
    apiFetch<Transaction>('/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateTransaction: (id: string, data: Partial<Transaction>) =>
    apiFetch<Transaction>(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteTransaction: (id: string) =>
    apiFetch(`/transactions/${id}`, { method: 'DELETE' }),
}
