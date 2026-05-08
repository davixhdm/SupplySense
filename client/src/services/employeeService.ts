import { apiFetch } from './api'

export const employeeService = {
  getEmployees: () => apiFetch('/employees'),
  getEmployee: (id: string) => apiFetch(`/employees/${id}`),
  createEmployee: (data: any) =>
    apiFetch('/employees', { method: 'POST', body: JSON.stringify(data) }),
  updateEmployee: (id: string, data: any) =>
    apiFetch(`/employees/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteEmployee: (id: string) =>
    apiFetch(`/employees/${id}`, { method: 'DELETE' }),
}
