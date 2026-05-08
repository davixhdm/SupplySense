import api from './api'

export const adminAuthService = {
  login: async (email: string, password: string) => {
    const { data } = await api.post('/admin/auth/login', { email, password })
    return data
  },

  getProfile: async () => {
    const { data } = await api.get('/admin/auth/profile')
    return data
  },

  updateProfile: async (profile: Record<string, any>) => {
    const { data } = await api.put('/admin/auth/profile', profile)
    return data
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const { data } = await api.put('/admin/auth/change-password', { currentPassword, newPassword })
    return data
  },

  forgotPassword: async (email: string) => {
    const { data } = await api.post('/admin/auth/forgot-password', { email })
    return data
  },

  resetPassword: async (token: string, newPassword: string) => {
    const { data } = await api.post('/admin/auth/reset-password', { token, newPassword })
    return data
  },

  logout: async () => {
    return api.post('/admin/auth/logout')
  }
}