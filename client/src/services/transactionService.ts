import { apiFetch } from './api'

export const transactionService = {
  getTransactions: () => apiFetch('/transactions'),
  getTransaction: (id: string) => apiFetch(`/transactions/${id}`),
  createTransaction: (data: any) =>
    apiFetch('/transactions', { method: 'POST', body: JSON.stringify(data) }),
  updateTransaction: (id: string, data: any) =>
    apiFetch(`/transactions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTransaction: (id: string) =>
    apiFetch(`/transactions/${id}`, { method: 'DELETE' }),
}
