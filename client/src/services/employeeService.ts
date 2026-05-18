import { apiFetch } from './api'
import { Employee, PaginatedResponse } from './types'

export const employeeService = {
  getEmployees: (page = 1, limit = 20) =>
    apiFetch<PaginatedResponse<Employee>>(
      `/employees?page=${page}&limit=${limit}`
    ),
  getDepartmentPerformance: () =>
    apiFetch<any>('/employees/departments'),
  getEmployee: (id: string) => apiFetch<Employee>(`/employees/${id}`),
  createEmployee: (data: Partial<Employee>) =>
    apiFetch<Employee>('/employees', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateEmployee: (id: string, data: Partial<Employee>) =>
    apiFetch<Employee>(`/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  recordPerformance: (id: string, data: any) =>
    apiFetch<Employee>(`/employees/${id}/performance`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteEmployee: (id: string) =>
    apiFetch(`/employees/${id}`, { method: 'DELETE' }),
}
