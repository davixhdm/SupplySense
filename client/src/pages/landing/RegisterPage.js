import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff, CheckCircle, AlertCircle, Key } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { AuthLayout } from '../../layouts/AuthLayout';
import { Button } from '../../components/common/Button';
import { AlertBanner } from '../../components/common/AlertBanner';
import { authService } from '../../services/authService';
export default function RegisterPage() {
    const navigate = useNavigate();
    const { setAuth } = useAuthStore();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        licenseKey: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    // Password strength calculator
    const getPasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8)
            strength++;
        if (password.length >= 12)
            strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password))
            strength++;
        if (/\d/.test(password))
            strength++;
        if (/[!@#$%^&*]/.test(password))
            strength++;
        return strength;
    };
    const passwordStrength = getPasswordStrength(formData.password);
    const passwordsMatch = formData.password === formData.confirmPassword;
    const getStrengthLabel = () => {
        if (passwordStrength === 0)
            return 'Very Weak';
        if (passwordStrength <= 1)
            return 'Weak';
        if (passwordStrength <= 2)
            return 'Fair';
        if (passwordStrength <= 3)
            return 'Good';
        if (passwordStrength <= 4)
            return 'Strong';
        return 'Very Strong';
    };
    const getStrengthColor = () => {
        if (passwordStrength === 0)
            return 'bg-gray-300';
        if (passwordStrength <= 1)
            return 'bg-red-500';
        if (passwordStrength <= 2)
            return 'bg-orange-500';
        if (passwordStrength <= 3)
            return 'bg-yellow-500';
        if (passwordStrength <= 4)
            return 'bg-blue-500';
        return 'bg-green-500';
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!agreeTerms) {
            setError('Please agree to the Terms of Service and Privacy Policy');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (passwordStrength < 2) {
            setError('Password is too weak. Please use a stronger password.');
            return;
        }
        setLoading(true);
        try {
            const response = await authService.register(formData.email, formData.password, formData.email.split('@')[0]);
            setAuth(response.user, response.token);
            navigate('/dashboard');
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx(AuthLayout, { children: _jsxs("div", { className: "w-full max-w-md", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h2", { className: "text-4xl font-bold text-gray-900 mb-2", children: "Get Started" }), _jsx("p", { className: "text-gray-600", children: "Create your SupplySense account in minutes" })] }), error && _jsx(AlertBanner, { type: "error", message: error, className: "mb-6" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-sm font-semibold text-gray-900", children: "Email Address" }), _jsxs("div", { className: "relative", children: [_jsx(Mail, { className: "absolute left-3 top-3 text-gray-400", size: 20 }), _jsx("input", { type: "email", placeholder: "you@example.com", value: formData.email, onChange: (e) => setFormData({ ...formData, email: e.target.value }), className: "w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 transition", required: true })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-sm font-semibold text-gray-900", children: "License Key" }), _jsxs("div", { className: "relative", children: [_jsx(Key, { className: "absolute left-3 top-3 text-gray-400", size: 20 }), _jsx("input", { type: "text", placeholder: "Enter your license key", value: formData.licenseKey, onChange: (e) => setFormData({ ...formData, licenseKey: e.target.value }), className: "w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 transition", required: true })] }), _jsx("p", { className: "text-xs text-gray-500", children: "You'll find this in your welcome email" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-sm font-semibold text-gray-900", children: "Password" }), _jsxs("div", { className: "relative", children: [_jsx(Lock, { className: "absolute left-3 top-3 text-gray-400", size: 20 }), _jsx("input", { type: showPassword ? 'text' : 'password', placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", value: formData.password, onChange: (e) => setFormData({ ...formData, password: e.target.value }), className: "w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 transition", required: true }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-3 top-3 text-gray-400 hover:text-gray-600", children: showPassword ? _jsx(EyeOff, { size: 20 }) : _jsx(Eye, { size: 20 }) })] }), formData.password && (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-xs text-gray-600", children: "Password Strength" }), _jsx("span", { className: `text-xs font-semibold ${passwordStrength <= 1 ? 'text-red-600' :
                                                        passwordStrength <= 2 ? 'text-orange-600' :
                                                            passwordStrength <= 3 ? 'text-yellow-600' :
                                                                passwordStrength <= 4 ? 'text-blue-600' :
                                                                    'text-green-600'}`, children: getStrengthLabel() })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2 overflow-hidden", children: _jsx("div", { className: `h-full ${getStrengthColor()} transition-all duration-300`, style: { width: `${(passwordStrength / 5) * 100}%` } }) }), _jsxs("ul", { className: "text-xs text-gray-600 space-y-1 pt-2", children: [_jsxs("li", { className: "flex items-center gap-1", children: [formData.password.length >= 8 ? (_jsx(CheckCircle, { size: 14, className: "text-green-600" })) : (_jsx(AlertCircle, { size: 14, className: "text-gray-400" })), "At least 8 characters"] }), _jsxs("li", { className: "flex items-center gap-1", children: [/[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password) ? (_jsx(CheckCircle, { size: 14, className: "text-green-600" })) : (_jsx(AlertCircle, { size: 14, className: "text-gray-400" })), "Mix of uppercase and lowercase"] }), _jsxs("li", { className: "flex items-center gap-1", children: [/\d/.test(formData.password) ? (_jsx(CheckCircle, { size: 14, className: "text-green-600" })) : (_jsx(AlertCircle, { size: 14, className: "text-gray-400" })), "At least one number"] })] })] }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-sm font-semibold text-gray-900", children: "Confirm Password" }), _jsxs("div", { className: "relative", children: [_jsx(Lock, { className: "absolute left-3 top-3 text-gray-400", size: 20 }), _jsx("input", { type: showConfirmPassword ? 'text' : 'password', placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", value: formData.confirmPassword, onChange: (e) => setFormData({ ...formData, confirmPassword: e.target.value }), className: "w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 transition", required: true }), _jsx("button", { type: "button", onClick: () => setShowConfirmPassword(!showConfirmPassword), className: "absolute right-3 top-3 text-gray-400 hover:text-gray-600", children: showConfirmPassword ? _jsx(EyeOff, { size: 20 }) : _jsx(Eye, { size: 20 }) })] }), formData.confirmPassword && (_jsx("p", { className: "text-xs flex items-center gap-1", children: passwordsMatch ? (_jsxs(_Fragment, { children: [_jsx(CheckCircle, { size: 14, className: "text-green-600" }), _jsx("span", { className: "text-green-600", children: "Passwords match" })] })) : (_jsxs(_Fragment, { children: [_jsx(AlertCircle, { size: 14, className: "text-red-600" }), _jsx("span", { className: "text-red-600", children: "Passwords don't match" })] })) }))] }), _jsxs("div", { className: "flex items-start gap-3 p-4 bg-blue-50 rounded-lg", children: [_jsx("input", { type: "checkbox", id: "agreeTerms", checked: agreeTerms, onChange: (e) => setAgreeTerms(e.target.checked), className: "w-4 h-4 mt-1 text-blue-600 border-gray-300 rounded cursor-pointer" }), _jsxs("label", { htmlFor: "agreeTerms", className: "text-sm text-gray-700 cursor-pointer leading-relaxed", children: ["I agree to the", ' ', _jsx(Link, { to: "#", className: "text-blue-600 font-semibold hover:underline", children: "Terms of Service" }), ' ', "and", ' ', _jsx(Link, { to: "#", className: "text-blue-600 font-semibold hover:underline", children: "Privacy Policy" })] })] }), _jsx(Button, { type: "submit", loading: loading, className: "w-full py-3 font-semibold text-lg", disabled: !agreeTerms || !passwordsMatch || passwordStrength < 2, children: _jsxs("span", { className: "flex items-center justify-center gap-2", children: ["Create Account", _jsx(ArrowRight, { size: 20 })] }) }), _jsxs("p", { className: "text-center text-gray-700 pt-4", children: ["Already have an account?", ' ', _jsx(Link, { to: "/login", className: "font-semibold text-blue-600 hover:text-blue-700 transition", children: "Sign in here" })] })] }), _jsx("div", { className: "mt-8 p-4 bg-green-50 rounded-lg border border-green-200", children: _jsx("p", { className: "text-xs text-green-900", children: "\uD83D\uDD12 Your data is encrypted end-to-end. We comply with GDPR, CCPA, and ISO 27001 standards." }) })] }) }));
}
