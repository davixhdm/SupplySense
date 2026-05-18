import { apiFetch } from './api'
import { Device, PaginatedResponse } from './types'

export const deviceService = {
  getDevices: (page = 1, limit = 20) =>
    apiFetch<PaginatedResponse<Device>>(`/devices?page=${page}&limit=${limit}`),
  getDevice: (id: string) => apiFetch<Device>(`/devices/${id}`),
  getDeviceActivity: (id: string) =>
    apiFetch<any>(`/devices/${id}/activity`),
  deactivateDevice: (id: string) =>
    apiFetch<Device>(`/devices/${id}/deactivate`, {
      method: 'PUT',
    }),
}
