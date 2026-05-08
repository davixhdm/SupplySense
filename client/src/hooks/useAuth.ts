import { useState, useEffect, useCallback, useContext, createContext } from 'react'
import { authService } from '../services/authService'

interface AuthUser {
  id: string
  email: string
  name: string
  role: 'admin' | 'manager' | 'user'
  licenseKey?: string
}

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
  validateLicense: (licenseKey: string) => Promise<boolean>
  updateProfile: (updates: Partial<AuthUser>) => Promise<void>
  error: string | null
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user')
        const token = localStorage.getItem('token')

        if (storedUser && token) {
          setUser(JSON.parse(storedUser))
        }
      } catch (err) {
        console.error('Failed to initialize auth:', err)
        setError('Failed to initialize authentication')
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await authService.login(email, password)
      const user: AuthUser = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        role: response.user.role,
      }

      setUser(user)
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('token', response.token)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const register = useCallback(
    async (email: string, password: string, name: string) => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await authService.register(email, password, name)
        const user: AuthUser = {
          id: response.user.id,
          email: response.user.email,
          name: response.user.name,
          role: response.user.role,
        }

        setUser(user)
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('token', response.token)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Registration failed')
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const logout = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      await authService.logout()
      setUser(null)
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const validateLicense = useCallback(async (licenseKey: string): Promise<boolean> => {
    try {
      const response = await authService.validateLicense(licenseKey)
      return response.valid
    } catch (err) {
      console.error('License validation failed:', err)
      return false
    }
  }, [])

  const updateProfile = useCallback(async (updates: Partial<AuthUser>) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await authService.updateProfile(updates)
      const updatedUser: AuthUser = {
        id: response.id,
        email: response.email,
        name: response.name,
        role: response.role,
      }

      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Profile update failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    validateLicense,
    updateProfile,
    error,
  }
}
