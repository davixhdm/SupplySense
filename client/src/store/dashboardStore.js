import { create } from 'zustand';
export const useDashboardStore = create((set) => ({
    selectedPeriod: 'month',
    setSelectedPeriod: (period) => set({ selectedPeriod: period }),
    sidebarOpen: true,
    setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
