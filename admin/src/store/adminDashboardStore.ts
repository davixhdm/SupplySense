import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface DashboardStats {
  totalOrgs: number
  activeLicenses: number
  trialOrgs: number
  pendingApprovals: number
  totalRevenue: number
}

interface AdminDashboardState {
  stats: DashboardStats | null
  loading: boolean
  sidebarCollapsed: boolean
  setStats: (stats: DashboardStats) => void
  setLoading: (loading: boolean) => void
  toggleSidebar: () => void
}

export const useAdminDashboardStore = create<AdminDashboardState>()(
  persist(
    (set) => ({
      stats: null,
      loading: false,
      sidebarCollapsed: false,
      setStats: (stats) => set({ stats }),
      setLoading: (loading) => set({ loading }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }))
    }),
    {
      name: 'supplysense-admin-sidebar',
      partialize: (state) => ({ sidebarCollapsed: state.sidebarCollapsed })
    }
  )
)