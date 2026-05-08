import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'

// Landing pages
import LandingPage from './pages/landing/LandingPage'
import LoginPage from './pages/landing/LoginPage'
import RegisterPage from './pages/landing/RegisterPage'
import LicenseKeyPage from './pages/landing/LicenseKeyPage'

// Dashboard pages
import DashboardPage from './pages/dashboard/DashboardPage'

function App() {
  const { isAuthenticated } = useAuthStore()

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/license" element={<LicenseKeyPage />} />

        {/* Protected routes */}
        {isAuthenticated ? (
          <Route path="/dashboard/*" element={<DashboardPage />} />
        ) : (
          <Route path="/dashboard/*" element={<Navigate to="/login" replace />} />
        )}

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
