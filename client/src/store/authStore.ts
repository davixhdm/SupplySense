import { create } from 'zustand'

interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'manager' | 'user'
}

interface AuthStore {
  isAuthenticated: boolean
  user: User | null
  token: string | null
  setAuth: (user: User, token: string) => void
  logout: () => void
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: !!localStorage.getItem('token'),
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
  token: localStorage.getItem('token'),
  
  setAuth: (user: User, token: string) => {
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('token', token)
    set({ isAuthenticated: true, user, token })
  },
  
  logout: () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    set({ isAuthenticated: false, user: null, token: null })
  },
  
  setUser: (user: User) => {
    localStorage.setItem('user', JSON.stringify(user))
    set({ user })
  },
}))
