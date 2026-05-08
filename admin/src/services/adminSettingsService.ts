import api from './api'

export const adminSettingsService = {
  getSystemSettings: async () => {
    const { data } = await api.get('/admin/settings')
    return data
  },

  updateSystemSettings: async (payload: Record<string, any>) => {
    const { data } = await api.put('/admin/settings', payload)
    return data
  },

  getUsers: async () => {
    const { data } = await api.get('/admin/users')
    return data
  },

  createUser: async (payload: Record<string, any>) => {
    const { data } = await api.post('/admin/users', payload)
    return data
  },

  updateUser: async (id: string, payload: Record<string, any>) => {
    const { data } = await api.put(`/admin/users/${id}`, payload)
    return data
  },

  deleteUser: async (id: string) => {
    const { data } = await api.delete(`/admin/users/${id}`)
    return data
  },

  getLegal: async (type: string) => {
    const { data } = await api.get(`/admin/legal/${type}`)
    return data
  },

  updateLegal: async (type: string, content: string) => {
    const { data } = await api.put(`/admin/legal/${type}`, { content })
    return data
  },

  getBackups: async () => {
    const { data } = await api.get('/admin/backups')
    return data
  },

  createBackup: async () => {
    const { data } = await api.post('/admin/backups')
    return data
  },

  deleteBackup: async (filename: string) => {
    const { data } = await api.delete(`/admin/backups/${filename}`)
    return data
  },

  emailBackup: async (filename: string) => {
    const { data } = await api.post(`/admin/backups/email/${filename}`)
    return data
  },

  shareBackup: async (filename: string, email: string) => {
    const { data } = await api.post(`/admin/backups/share/${filename}`, { email })
    return data
  },

  restoreBackup: async (filename: string) => {
    const { data } = await api.post(`/admin/backups/restore/${filename}`)
    return data
  },

  updateSchedule: async (schedule: Record<string, any>) => {
    const { data } = await api.put('/admin/backups/schedule', schedule)
    return data
  },

  importBackup: async (formData: FormData) => {
    const { data } = await api.post('/admin/backups/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return data
  }
}