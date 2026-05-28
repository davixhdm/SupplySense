import api from './api'

export const paymentService = {
  getPending: async (params?: Record<string, any>) => {
    const { data } = await api.get('/admin/pending-activations', { params: { ...params, status: 'pending' } })
    return data
  },

  approve: async (id: string) => {
    const { data } = await api.post(`/admin/pending-activations/${id}/approve`)
    return data
  },

  reject: async (id: string, reason?: string) => {
    const { data } = await api.post(`/admin/pending-activations/${id}/reject`, { reason })
    return data
  },

  getHistory: async (params?: Record<string, any>) => {
    const { data } = await api.get('/admin/payments', { params })
    return data
  },

  getPaymentById: async (id: string) => {
    const { data } = await api.get(`/admin/payments/${id}`)
    return data
  },

  refund: async (id: string, payload: Record<string, any>) => {
    const { data } = await api.post(`/admin/payments/${id}/refund`, payload)
    return data
  },

  deletePayment: async (id: string) => {
    const { data } = await api.delete(`/admin/payments/${id}`)
    return data
  },

  getConfig: async () => {
    const { data } = await api.get('/admin/payment-config')
    return data
  },

  getPlans: async () => {
    const { data } = await api.get('/admin/plans-pricing')
    return data
  },

  updatePlans: async (payload: Record<string, any>) => {
    const { data } = await api.put('/admin/plans-pricing', payload)
    return data
  }
}