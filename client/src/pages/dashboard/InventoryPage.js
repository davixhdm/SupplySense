import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Widget } from '../../components/dashboard/Widget';
import { Table } from '../../components/common/Table';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { AlertCircle } from 'lucide-react';
export default function InventoryPage() {
    const [inventory, setInventory] = useState([
        {
            id: '1',
            sku: 'SKU-001',
            name: 'Premium Widget A',
            currentStock: 45,
            reorderPoint: 50,
            supplier: 'Global Parts Inc',
            stockoutRisk: 'high',
            lastRestocked: '2024-01-10',
        },
        {
            id: '2',
            sku: 'SKU-002',
            name: 'Standard Component B',
            currentStock: 230,
            reorderPoint: 100,
            supplier: 'Tech Supply Ltd',
            stockoutRisk: 'low',
            lastRestocked: '2024-01-12',
        },
        {
            id: '3',
            sku: 'SKU-003',
            name: 'Connector Pack C',
            currentStock: 78,
            reorderPoint: 80,
            supplier: 'Universal Supplies',
            stockoutRisk: 'medium',
            lastRestocked: '2024-01-08',
        },
    ]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const getRiskColor = (risk) => {
        const colors = {
            low: 'bg-green-100 text-green-800',
            medium: 'bg-yellow-100 text-yellow-800',
            high: 'bg-red-100 text-red-800',
        };
        return colors[risk] || 'bg-gray-100 text-gray-800';
    };
    const getStockStatus = (current, reorder) => {
        if (current <= reorder)
            return 'bg-red-50 border-red-200';
        if (current <= reorder * 1.5)
            return 'bg-yellow-50 border-yellow-200';
        return 'bg-green-50 border-green-200';
    };
    const columns = [
        { key: 'sku', label: 'SKU' },
        { key: 'name', label: 'Product Name' },
        {
            key: 'currentStock',
            label: 'Current Stock',
            render: (val, item) => (_jsx("div", { className: `px-3 py-1 rounded border ${getStockStatus(val, item.reorderPoint)}`, children: val })),
        },
        { key: 'reorderPoint', label: 'Reorder Point' },
        { key: 'supplier', label: 'Supplier' },
        {
            key: 'stockoutRisk',
            label: 'Stockout Risk',
            render: (val) => (_jsx("span", { className: `px-2 py-1 rounded text-sm font-medium ${getRiskColor(val)}`, children: val })),
        },
        { key: 'lastRestocked', label: 'Last Restocked' },
    ];
    return (_jsx(DashboardLayout, { children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Inventory" }), _jsx(Button, { onClick: () => { }, children: "Add Item" })] }), _jsxs("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3", children: [_jsx(AlertCircle, { className: "w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-red-900", children: "Low Stock Alerts" }), _jsx("p", { className: "text-sm text-red-700", children: "3 items below reorder point. Reorder recommended." })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsx(Input, { label: "Search Inventory", type: "text", placeholder: "SKU, product name...", value: search, onChange: (e) => setSearch(e.target.value) }), _jsxs("select", { className: "px-3 py-2 border border-gray-300 rounded-lg text-gray-900", children: [_jsx("option", { children: "All Risk Levels" }), _jsx("option", { children: "Low" }), _jsx("option", { children: "Medium" }), _jsx("option", { children: "High" })] }), _jsxs("select", { className: "px-3 py-2 border border-gray-300 rounded-lg text-gray-900", children: [_jsx("option", { children: "All Suppliers" }), _jsx("option", { children: "Global Parts Inc" }), _jsx("option", { children: "Tech Supply Ltd" }), _jsx("option", { children: "Universal Supplies" })] })] }), _jsx(Widget, { title: "Inventory Items", children: _jsx(Table, { columns: columns, data: inventory, loading: loading }) })] }) }));
}
