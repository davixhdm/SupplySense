import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Widget } from '../../components/dashboard/Widget';
import { Table } from '../../components/common/Table';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
export default function OrdersPage() {
    const [orders, setOrders] = useState([
        {
            id: '1',
            orderNumber: 'ORD-001',
            customer: 'ACME Corp',
            amount: 2500,
            status: 'delivered',
            riskPrediction: 'low',
            date: '2024-01-15',
        },
        {
            id: '2',
            orderNumber: 'ORD-002',
            customer: 'TechStart Inc',
            amount: 5300,
            status: 'shipped',
            riskPrediction: 'medium',
            date: '2024-01-14',
        },
        {
            id: '3',
            orderNumber: 'ORD-003',
            customer: 'Global Trade Ltd',
            amount: 1800,
            status: 'confirmed',
            riskPrediction: 'high',
            date: '2024-01-13',
        },
    ]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        // Fetch orders from API
    }, []);
    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            confirmed: 'bg-blue-100 text-blue-800',
            shipped: 'bg-purple-100 text-purple-800',
            delivered: 'bg-green-100 text-green-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };
    const getRiskColor = (risk) => {
        const colors = {
            low: 'bg-green-100 text-green-800',
            medium: 'bg-yellow-100 text-yellow-800',
            high: 'bg-red-100 text-red-800',
        };
        return colors[risk] || 'bg-gray-100 text-gray-800';
    };
    const columns = [
        { key: 'orderNumber', label: 'Order #' },
        { key: 'customer', label: 'Customer' },
        { key: 'amount', label: 'Amount', render: (val) => `$${val}` },
        {
            key: 'status',
            label: 'Status',
            render: (val) => (_jsx("span", { className: `px-2 py-1 rounded text-sm font-medium ${getStatusColor(val)}`, children: val })),
        },
        {
            key: 'riskPrediction',
            label: 'Fulfillment Risk',
            render: (val) => (_jsx("span", { className: `px-2 py-1 rounded text-sm font-medium ${getRiskColor(val)}`, children: val })),
        },
        { key: 'date', label: 'Date' },
    ];
    return (_jsx(DashboardLayout, { children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Orders" }), _jsx(Button, { onClick: () => { }, children: "New Order" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsx(Input, { label: "Search Orders", type: "text", placeholder: "Order #, customer...", value: search, onChange: (e) => setSearch(e.target.value) }), _jsxs("select", { className: "px-3 py-2 border border-gray-300 rounded-lg text-gray-900", children: [_jsx("option", { children: "All Statuses" }), _jsx("option", { children: "Pending" }), _jsx("option", { children: "Confirmed" }), _jsx("option", { children: "Shipped" }), _jsx("option", { children: "Delivered" })] }), _jsxs("select", { className: "px-3 py-2 border border-gray-300 rounded-lg text-gray-900", children: [_jsx("option", { children: "All Risk Levels" }), _jsx("option", { children: "Low" }), _jsx("option", { children: "Medium" }), _jsx("option", { children: "High" })] })] }), _jsx(Widget, { title: "Orders", children: _jsx(Table, { columns: columns, data: orders, loading: loading }) })] }) }));
}
