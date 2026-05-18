import { apiFetch } from './api'
import { Backup, PaginatedResponse } from './types'

export const backupService = {
  createBackup: () =>
    apiFetch<Backup>('/backups', { method: 'POST' }),
  getBackups: (page = 1, limit = 20) =>
    apiFetch<PaginatedResponse<Backup>>(`/backups?page=${page}&limit=${limit}`),
  downloadBackup: (filename: string) =>
    apiFetch<Blob>(`/backups/download/${filename}`),
}
