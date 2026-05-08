import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Widget } from '../../components/dashboard/Widget';
import { Table } from '../../components/common/Table';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { AlertCircle } from 'lucide-react';
export default function CustomersPage() {
    const [customers, setCustomers] = useState([
        {
            id: '1',
            name: 'ACME Corporation',
            email: 'contact@acme.com',
            phone: '+1-555-0101',
            totalOrders: 24,
            totalValue: 125000,
            churnRisk: 'low',
            segment: 'Enterprise',
            lastOrderDate: '2024-01-15',
        },
        {
            id: '2',
            name: 'TechStart Inc',
            email: 'sales@techstart.com',
            phone: '+1-555-0102',
            totalOrders: 8,
            totalValue: 42500,
            churnRisk: 'high',
            segment: 'SMB',
            lastOrderDate: '2023-12-20',
        },
        {
            id: '3',
            name: 'Global Trade Ltd',
            email: 'procurement@globaltrade.com',
            phone: '+44-20-1234-5678',
            totalOrders: 156,
            totalValue: 890000,
            churnRisk: 'low',
            segment: 'Enterprise',
            lastOrderDate: '2024-01-18',
        },
    ]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const getChurnRiskColor = (risk) => {
        const colors = {
            low: 'bg-green-100 text-green-800',
            medium: 'bg-yellow-100 text-yellow-800',
            high: 'bg-red-100 text-red-800',
        };
        return colors[risk] || 'bg-gray-100 text-gray-800';
    };
    const columns = [
        { key: 'name', label: 'Customer Name' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'totalOrders', label: 'Total Orders' },
        { key: 'totalValue', label: 'Lifetime Value', render: (val) => `$${val.toLocaleString()}` },
        {
            key: 'churnRisk',
            label: 'Churn Risk',
            render: (val) => (_jsx("span", { className: `px-2 py-1 rounded text-sm font-medium ${getChurnRiskColor(val)}`, children: val })),
        },
        { key: 'segment', label: 'Segment' },
        { key: 'lastOrderDate', label: 'Last Order' },
    ];
    return (_jsx(DashboardLayout, { children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Customers" }), _jsx(Button, { onClick: () => { }, children: "Add Customer" })] }), _jsxs("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3", children: [_jsx(AlertCircle, { className: "w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-red-900", children: "High Churn Risk Customers" }), _jsx("p", { className: "text-sm text-red-700", children: "3 customers identified with high churn risk. Consider reaching out." })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsx(Input, { label: "Search Customers", type: "text", placeholder: "Name, email, phone...", value: search, onChange: (e) => setSearch(e.target.value) }), _jsxs("select", { className: "px-3 py-2 border border-gray-300 rounded-lg text-gray-900", children: [_jsx("option", { children: "All Segments" }), _jsx("option", { children: "Enterprise" }), _jsx("option", { children: "SMB" }), _jsx("option", { children: "Startup" })] }), _jsxs("select", { className: "px-3 py-2 border border-gray-300 rounded-lg text-gray-900", children: [_jsx("option", { children: "All Churn Risks" }), _jsx("option", { children: "Low" }), _jsx("option", { children: "Medium" }), _jsx("option", { children: "High" })] })] }), _jsx(Widget, { title: "Customers", children: _jsx(Table, { columns: columns, data: customers, loading: loading }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs(Widget, { title: "Total Customers", children: [_jsx("p", { className: "text-4xl font-bold text-gray-900", children: "248" }), _jsx("p", { className: "text-sm text-gray-600 mt-2", children: "+12 this month" })] }), _jsxs(Widget, { title: "Avg Order Value", children: [_jsx("p", { className: "text-4xl font-bold text-gray-900", children: "$3,245" }), _jsx("p", { className: "text-sm text-gray-600 mt-2", children: "+5% vs last month" })] }), _jsxs(Widget, { title: "High Risk Customers", children: [_jsx("p", { className: "text-4xl font-bold text-red-600", children: "18" }), _jsx("p", { className: "text-sm text-gray-600 mt-2", children: "7.3% of customer base" })] })] })] }) }));
}
