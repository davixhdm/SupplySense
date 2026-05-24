import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import AdminAuthLayout from './layouts/AdminAuthLayout'
import AdminDashboardLayout from './layouts/AdminDashboardLayout'
import AdminLoginPage from './pages/auth/AdminLoginPage'
import AdminDashboardPage from './pages/dashboard/AdminDashboardPage'
import ApplicationsPage from './pages/dashboard/ApplicationsPage'
import PaymentPage from './pages/dashboard/PaymentPage'
import SystemLogsPage from './pages/dashboard/SystemLogsPage'
import AdminAnalyticsPage from './pages/dashboard/AdminAnalyticsPage'
import APICallsPage from './pages/dashboard/APICallsPage'
import SettingsPage from './pages/dashboard/settings/SettingsPage'
import { useAdminAuthStore } from './store/adminAuthStore'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAdminAuthStore((state) => state.token)
  const isHydrated = useAdminAuthStore((state) => state.isHydrated)
  if (!isHydrated) return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>
  if (!token) return <Navigate to="/admin/login" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Routes>
        <Route path="/admin/login" element={<AdminAuthLayout />}>
          <Route index element={<AdminLoginPage />} />
        </Route>
        <Route path="/admin" element={<ProtectedRoute><AdminDashboardLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="applications" element={<ApplicationsPage />} />
          <Route path="payments" element={<PaymentPage />} />
          <Route path="logs" element={<SystemLogsPage />} />
          <Route path="analytics" element={<AdminAnalyticsPage />} />
          <Route path="api-calls" element={<APICallsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}