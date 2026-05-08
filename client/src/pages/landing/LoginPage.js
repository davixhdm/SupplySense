import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { AuthLayout } from '../../layouts/AuthLayout';
import { Button } from '../../components/common/Button';
import { AlertBanner } from '../../components/common/AlertBanner';
import { authService } from '../../services/authService';
export default function LoginPage() {
    const navigate = useNavigate();
    const { setAuth } = useAuthStore();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await authService.login(formData.email, formData.password);
            setAuth(response.user, response.token);
            if (rememberMe) {
                localStorage.setItem('rememberEmail', formData.email);
            }
            navigate('/dashboard');
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx(AuthLayout, { children: _jsxs("div", { className: "w-full max-w-md", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h2", { className: "text-4xl font-bold text-gray-900 mb-2", children: "Welcome Back" }), _jsx("p", { className: "text-gray-600", children: "Sign in to your SupplySense account" })] }), error && _jsx(AlertBanner, { type: "error", message: error, className: "mb-6" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-sm font-semibold text-gray-900", children: "Email Address" }), _jsxs("div", { className: "relative", children: [_jsx(Mail, { className: "absolute left-3 top-3 text-gray-400", size: 20 }), _jsx("input", { type: "email", placeholder: "you@example.com", value: formData.email, onChange: (e) => setFormData({ ...formData, email: e.target.value }), className: "w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 transition", required: true })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("label", { className: "block text-sm font-semibold text-gray-900", children: "Password" }), _jsx(Link, { to: "#", className: "text-sm text-blue-600 hover:text-blue-700 font-medium", children: "Forgot password?" })] }), _jsxs("div", { className: "relative", children: [_jsx(Lock, { className: "absolute left-3 top-3 text-gray-400", size: 20 }), _jsx("input", { type: showPassword ? 'text' : 'password', placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", value: formData.password, onChange: (e) => setFormData({ ...formData, password: e.target.value }), className: "w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 transition", required: true }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-3 top-3 text-gray-400 hover:text-gray-600", children: showPassword ? _jsx(EyeOff, { size: 20 }) : _jsx(Eye, { size: 20 }) })] })] }), _jsxs("div", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", id: "rememberMe", checked: rememberMe, onChange: (e) => setRememberMe(e.target.checked), className: "w-4 h-4 text-blue-600 border-gray-300 rounded cursor-pointer" }), _jsx("label", { htmlFor: "rememberMe", className: "ml-2 text-sm text-gray-700 cursor-pointer", children: "Remember me for 30 days" })] }), _jsx(Button, { type: "submit", loading: loading, className: "w-full py-3 font-semibold text-lg", children: _jsxs("span", { className: "flex items-center justify-center gap-2", children: ["Sign In", _jsx(ArrowRight, { size: 20 })] }) }), _jsxs("div", { className: "relative my-8", children: [_jsx("div", { className: "absolute inset-0 flex items-center", children: _jsx("div", { className: "w-full border-t border-gray-200" }) }), _jsx("div", { className: "relative flex justify-center text-sm", children: _jsx("span", { className: "px-2 bg-white text-gray-600", children: "Or continue with" }) })] }), _jsx("div", { className: "grid grid-cols-3 gap-3", children: [
                                { name: 'Google', icon: '🔍' },
                                { name: 'GitHub', icon: '🐙' },
                                { name: 'Microsoft', icon: '🪟' },
                            ].map((provider) => (_jsx("button", { type: "button", className: "py-3 px-2 border-2 border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition text-center font-medium text-sm", children: _jsx("span", { className: "text-xl", children: provider.icon }) }, provider.name))) }), _jsxs("p", { className: "text-center text-gray-700 pt-4", children: ["Don't have an account?", ' ', _jsx(Link, { to: "/register", className: "font-semibold text-blue-600 hover:text-blue-700 transition", children: "Create one now" })] })] }), _jsx("div", { className: "mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200", children: _jsx("p", { className: "text-xs text-blue-900", children: "\uD83D\uDD12 Your connection is secure and encrypted. We never store your password on our servers." }) })] }) }));
}
