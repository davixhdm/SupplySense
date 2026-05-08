import axios from 'axios'
import { API_URL } from '../utils/constants'
import { useAdminAuthStore } from '../store/adminAuthStore'

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use((config) => {
  const token = useAdminAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isHydrated = useAdminAuthStore.getState().isHydrated
      if (isHydrated) {
        useAdminAuthStore.getState().clearAuth()
        window.location.href = '/admin/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api