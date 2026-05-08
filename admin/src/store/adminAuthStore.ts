import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Admin {
  _id: string
  fullName: string
  email: string
  role: string
  phone: string
  avatar: string
  isActive: boolean
}

interface AdminAuthState {
  token: string | null
  admin: Admin | null
  isHydrated: boolean
  setAuth: (token: string, admin: Admin) => void
  clearAuth: () => void
  setHydrated: () => void
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      token: null,
      admin: null,
      isHydrated: false,
      setAuth: (token, admin) => set({ token, admin, isHydrated: true }),
      clearAuth: () => set({ token: null, admin: null, isHydrated: true }),
      setHydrated: () => set({ isHydrated: true })
    }),
    {
      name: 'supplysense-admin-auth',
      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      }
    }
  )
)