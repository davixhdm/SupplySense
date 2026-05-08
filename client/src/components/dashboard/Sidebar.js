import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { BarChart3, Package, TrendingUp, Users, Settings, AlertCircle } from 'lucide-react';
export function Sidebar() {
    const menuItems = [
        { label: 'Dashboard', icon: BarChart3, href: '/dashboard' },
        { label: 'Orders', icon: Package, href: '/dashboard/orders' },
        { label: 'Inventory', icon: TrendingUp, href: '/dashboard/inventory' },
        { label: 'Suppliers', icon: Users, href: '/dashboard/suppliers' },
        { label: 'Customers', icon: Users, href: '/dashboard/customers' },
        { label: 'Alerts', icon: AlertCircle, href: '/dashboard/alerts' },
        { label: 'Settings', icon: Settings, href: '/dashboard/settings' },
    ];
    return (_jsxs("div", { className: "w-64 bg-gray-900 text-white h-screen overflow-y-auto fixed left-0 top-0", children: [_jsx("div", { className: "p-6 border-b border-gray-800", children: _jsx("h1", { className: "text-2xl font-bold text-blue-400", children: "SupplySense" }) }), _jsx("nav", { className: "p-4", children: menuItems.map((item) => {
                    const Icon = item.icon;
                    return (_jsxs(Link, { to: item.href, className: "flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors", children: [_jsx(Icon, { size: 20 }), _jsx("span", { children: item.label })] }, item.label));
                }) })] }));
}
