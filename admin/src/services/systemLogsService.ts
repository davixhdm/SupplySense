import api from './api'

export const systemLogsService = {
  getAll: async (params?: Record<string, any>) => {
    const { data } = await api.get('/admin/logs', { params })
    return data
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/admin/logs/${id}`)
    return data
  }
}