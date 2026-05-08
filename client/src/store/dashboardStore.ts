import { create } from 'zustand'

interface DashboardStore {
  selectedPeriod: 'day' | 'week' | 'month' | 'year'
  setSelectedPeriod: (period: 'day' | 'week' | 'month' | 'year') => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  selectedPeriod: 'month',
  setSelectedPeriod: (period) => set({ selectedPeriod: period }),
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}))
