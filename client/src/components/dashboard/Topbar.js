import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuthStore } from '../../store/authStore';
import { LogOut, User } from 'lucide-react';
export function Topbar() {
    const { user, logout } = useAuthStore();
    return (_jsx("div", { className: "bg-white border-b shadow-sm sticky top-0 z-40", children: _jsxs("div", { className: "flex justify-between items-center px-8 py-4 ml-64", children: [_jsx("h2", { className: "text-2xl font-semibold text-gray-800", children: "Dashboard" }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "text-right", children: [_jsx("p", { className: "font-medium text-gray-900", children: user?.email }), _jsx("p", { className: "text-sm text-gray-600", children: user?.role })] }), _jsx("button", { onClick: logout, className: "flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg", children: _jsx(User, { size: 20 }) }), _jsxs("button", { onClick: logout, className: "flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg", children: [_jsx(LogOut, { size: 20 }), "Logout"] })] })] }) }));
}
