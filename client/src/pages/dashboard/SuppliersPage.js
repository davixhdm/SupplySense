import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Widget } from '../../components/dashboard/Widget';
import { Table } from '../../components/common/Table';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Star } from 'lucide-react';
export default function SuppliersPage() {
    const [suppliers, setSuppliers] = useState([
        {
            id: '1',
            name: 'Global Parts Inc',
            location: 'China',
            reliability: 94,
            onTimeDelivery: 91,
            totalOrders: 156,
            activeProducts: 24,
            performanceScore: 4.8,
        },
        {
            id: '2',
            name: 'Tech Supply Ltd',
            location: 'USA',
            reliability: 97,
            onTimeDelivery: 96,
            totalOrders: 203,
            activeProducts: 45,
            performanceScore: 4.9,
        },
        {
            id: '3',
            name: 'Universal Supplies',
            location: 'Germany',
            reliability: 88,
            onTimeDelivery: 85,
            totalOrders: 89,
            activeProducts: 18,
            performanceScore: 4.4,
        },
    ]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const getReliabilityColor = (score) => {
        if (score >= 95)
            return 'bg-green-100 text-green-800';
        if (score >= 85)
            return 'bg-blue-100 text-blue-800';
        return 'bg-yellow-100 text-yellow-800';
    };
    const renderStars = (score) => {
        return (_jsxs("div", { className: "flex items-center gap-1", children: [[...Array(5)].map((_, i) => (_jsx(Star, { className: `w-4 h-4 ${i < Math.floor(score) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}` }, i))), _jsx("span", { className: "ml-2 text-sm text-gray-600", children: score })] }));
    };
    const columns = [
        { key: 'name', label: 'Supplier Name' },
        { key: 'location', label: 'Location' },
        {
            key: 'reliability',
            label: 'Reliability',
            render: (val) => (_jsxs("span", { className: `px-2 py-1 rounded text-sm font-medium ${getReliabilityColor(val)}`, children: [val, "%"] })),
        },
        { key: 'onTimeDelivery', label: 'On-Time Delivery', render: (val) => `${val}%` },
        { key: 'totalOrders', label: 'Total Orders' },
        { key: 'activeProducts', label: 'Active Products' },
        {
            key: 'performanceScore',
            label: 'Performance',
            render: (val) => renderStars(val),
        },
    ];
    return (_jsx(DashboardLayout, { children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Suppliers" }), _jsx(Button, { onClick: () => { }, children: "Add Supplier" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsx(Input, { label: "Search Suppliers", type: "text", placeholder: "Supplier name, location...", value: search, onChange: (e) => setSearch(e.target.value) }), _jsxs("select", { className: "px-3 py-2 border border-gray-300 rounded-lg text-gray-900", children: [_jsx("option", { children: "All Locations" }), _jsx("option", { children: "USA" }), _jsx("option", { children: "China" }), _jsx("option", { children: "Germany" }), _jsx("option", { children: "India" })] }), _jsxs("select", { className: "px-3 py-2 border border-gray-300 rounded-lg text-gray-900", children: [_jsx("option", { children: "Sort by" }), _jsx("option", { children: "Performance Score" }), _jsx("option", { children: "Reliability" }), _jsx("option", { children: "Total Orders" })] })] }), _jsx(Widget, { title: "Suppliers", children: _jsx(Table, { columns: columns, data: suppliers, loading: loading }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsx(Widget, { title: "Top Performer", children: _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-2xl font-bold text-gray-900", children: "Tech Supply Ltd" }), _jsx("div", { className: "mt-3 flex justify-center", children: renderStars(4.9) }), _jsx("p", { className: "mt-2 text-sm text-gray-600", children: "97% reliability score" })] }) }), _jsxs(Widget, { title: "Total Active Suppliers", children: [_jsx("p", { className: "text-4xl font-bold text-gray-900 text-center", children: "12" }), _jsx("p", { className: "text-center text-sm text-gray-600 mt-2", children: "Across 8 countries" })] }), _jsxs(Widget, { title: "Avg Performance Score", children: [_jsx("p", { className: "text-4xl font-bold text-blue-600 text-center", children: "4.7" }), _jsx("p", { className: "text-center text-sm text-gray-600 mt-2", children: "Out of 5.0" })] })] })] }) }));
}
