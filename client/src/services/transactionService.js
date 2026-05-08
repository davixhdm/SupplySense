import { apiFetch } from './api';
export const transactionService = {
    getTransactions: (page = 1, limit = 20) => apiFetch(`/transactions?page=${page}&limit=${limit}`),
    getTransaction: (id) => apiFetch(`/transactions/${id}`),
    createTransaction: (data) => apiFetch('/transactions', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    updateTransaction: (id, data) => apiFetch(`/transactions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    deleteTransaction: (id) => apiFetch(`/transactions/${id}`, { method: 'DELETE' }),
};
