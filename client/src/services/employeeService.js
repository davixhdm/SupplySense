import { apiFetch } from './api';
export const employeeService = {
    getEmployees: (page = 1, limit = 20) => apiFetch(`/employees?page=${page}&limit=${limit}`),
    getEmployee: (id) => apiFetch(`/employees/${id}`),
    createEmployee: (data) => apiFetch('/employees', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    updateEmployee: (id, data) => apiFetch(`/employees/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    deleteEmployee: (id) => apiFetch(`/employees/${id}`, { method: 'DELETE' }),
};
