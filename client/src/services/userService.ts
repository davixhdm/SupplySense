import { apiFetch } from './api'
import { User, PaginatedResponse } from './types'

export const userService = {
  getUsers: (page = 1, limit = 20) =>
    apiFetch<PaginatedResponse<User>>(`/users?page=${page}&limit=${limit}`),
  getUser: (id: string) => apiFetch<User>(`/users/${id}`),
  createUser: (data: Partial<User>) =>
    apiFetch<User>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateUser: (id: string, data: Partial<User>) =>
    apiFetch<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteUser: (id: string) =>
    apiFetch(`/users/${id}`, { method: 'DELETE' }),
}
