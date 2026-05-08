import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
// Landing pages
import LandingPage from './pages/landing/LandingPage';
import LoginPage from './pages/landing/LoginPage';
import RegisterPage from './pages/landing/RegisterPage';
import LicenseKeyPage from './pages/landing/LicenseKeyPage';
// Dashboard pages
import DashboardPage from './pages/dashboard/DashboardPage';
function App() {
    const { isAuthenticated } = useAuthStore();
    return (_jsx(Router, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(LandingPage, {}) }), _jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/register", element: _jsx(RegisterPage, {}) }), _jsx(Route, { path: "/license", element: _jsx(LicenseKeyPage, {}) }), isAuthenticated ? (_jsx(Route, { path: "/dashboard/*", element: _jsx(DashboardPage, {}) })) : (_jsx(Route, { path: "/dashboard/*", element: _jsx(Navigate, { to: "/login", replace: true }) })), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) }));
}
export default App;
