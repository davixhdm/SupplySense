import api from './api'

export const applicationsService = {
  getAll: async (params?: Record<string, any>) => {
    const { data } = await api.get('/admin/applications', { params })
    return data
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/admin/applications/${id}`)
    return data
  },

  updatePlan: async (id: string, payload: Record<string, any>) => {
    const { data } = await api.put(`/admin/applications/${id}/plan`, payload)
    return data
  },

  suspend: async (id: string, reason?: string) => {
    const { data } = await api.put(`/admin/applications/${id}/suspend`, { reason })
    return data
  },

  reactivate: async (id: string) => {
    const { data } = await api.put(`/admin/applications/${id}/reactivate`)
    return data
  },

  extendTrial: async (id: string, days: number) => {
    const { data } = await api.put(`/admin/applications/${id}/extend-trial`, { days })
    return data
  }
}