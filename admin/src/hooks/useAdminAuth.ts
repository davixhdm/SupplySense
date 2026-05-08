import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuthStore } from '../store/adminAuthStore'
import { adminAuthService } from '../services/adminAuthService'

export function useAdminAuth() {
  const { token, admin, setAuth, clearAuth } = useAdminAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (token) {
      adminAuthService.getProfile()
        .then((res) => setAuth(token, res.admin))
        .catch(() => clearAuth())
    }
  }, [])

  const login = async (email: string, password: string) => {
    const res = await adminAuthService.login(email, password)
    setAuth(res.token, res.admin)
    navigate('/admin/dashboard')
  }

  const logout = () => {
    clearAuth()
    navigate('/admin/login')
  }

  return { token, admin, login, logout, isAuthenticated: !!token }
}