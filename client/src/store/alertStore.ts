import { create } from 'zustand'

export interface Alert {
  id: string
  type: 'info' | 'warning' | 'error' | 'success'
  message: string
  timestamp: Date
  read: boolean
}

interface AlertStore {
  alerts: Alert[]
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp' | 'read'>) => void
  markAsRead: (id: string) => void
  deleteAlert: (id: string) => void
  clearAll: () => void
}

export const useAlertStore = create<AlertStore>((set) => ({
  alerts: [],
  
  addAlert: (alert) => set((state) => ({
    alerts: [{
      ...alert,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false,
    }, ...state.alerts],
  })),
  
  markAsRead: (id) => set((state) => ({
    alerts: state.alerts.map((alert) =>
      alert.id === id ? { ...alert, read: true } : alert
    ),
  })),
  
  deleteAlert: (id) => set((state) => ({
    alerts: state.alerts.filter((alert) => alert.id !== id),
  })),
  
  clearAll: () => set({ alerts: [] }),
}))
