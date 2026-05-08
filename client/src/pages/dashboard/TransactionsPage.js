import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Widget } from '../../components/dashboard/Widget';
import { Table } from '../../components/common/Table';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Download } from 'lucide-react';
export default function TransactionsPage() {
    const [transactions, setTransactions] = useState([
        {
            id: '1',
            date: '2024-01-18',
            description: 'Order Payment - ORD-001',
            category: 'Sales',
            amount: 2500,
            type: 'income',
            status: 'completed',
            reference: 'TXN-001',
        },
        {
            id: '2',
            date: '2024-01-17',
            description: 'Supplier Invoice - Global Parts Inc',
            category: 'Purchases',
            amount: 5300,
            type: 'expense',
            status: 'completed',
            reference: 'TXN-002',
        },
        {
            id: '3',
            date: '2024-01-16',
            description: 'Payroll - January',
            category: 'Salaries',
            amount: 45000,
            type: 'expense',
            status: 'pending',
            reference: 'TXN-003',
        },
        {
            id: '4',
            date: '2024-01-15',
            description: 'Bank Transfer - Shipping',
            category: 'Logistics',
            amount: 1200,
            type: 'expense',
            status: 'completed',
            reference: 'TXN-004',
        },
    ]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const getStatusColor = (status) => {
        const colors = {
            completed: 'bg-green-100 text-green-800',
            pending: 'bg-yellow-100 text-yellow-800',
            failed: 'bg-red-100 text-red-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };
    const getTypeColor = (type) => {
        return type === 'income' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold';
    };
    const columns = [
        { key: 'date', label: 'Date' },
        { key: 'description', label: 'Description' },
        { key: 'category', label: 'Category' },
        {
            key: 'amount',
            label: 'Amount',
            render: (val, item) => (_jsxs("span", { className: getTypeColor(item.type), children: [item.type === 'income' ? '+' : '-', "$", val.toLocaleString()] })),
        },
        {
            key: 'status',
            label: 'Status',
            render: (val) => (_jsx("span", { className: `px-2 py-1 rounded text-sm font-medium ${getStatusColor(val)}`, children: val })),
        },
        { key: 'reference', label: 'Reference' },
    ];
    const totalIncome = transactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    const netProfit = totalIncome - totalExpense;
    return (_jsx(DashboardLayout, { children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Transactions" }), _jsxs(Button, { onClick: () => { }, className: "flex items-center gap-2", children: [_jsx(Download, { className: "w-4 h-4" }), "Export"] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs(Widget, { title: "Total Income", children: [_jsxs("p", { className: "text-4xl font-bold text-green-600", children: ["$", totalIncome.toLocaleString()] }), _jsx("p", { className: "text-sm text-gray-600 mt-2", children: "From sales & orders" })] }), _jsxs(Widget, { title: "Total Expenses", children: [_jsxs("p", { className: "text-4xl font-bold text-red-600", children: ["$", totalExpense.toLocaleString()] }), _jsx("p", { className: "text-sm text-gray-600 mt-2", children: "Purchases & operations" })] }), _jsxs(Widget, { title: "Net Profit", children: [_jsxs("p", { className: `text-4xl font-bold ${netProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`, children: ["$", netProfit.toLocaleString()] }), _jsx("p", { className: "text-sm text-gray-600 mt-2", children: "This period" })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsx(Input, { label: "Search Transactions", type: "text", placeholder: "Description, reference...", value: search, onChange: (e) => setSearch(e.target.value) }), _jsxs("select", { className: "px-3 py-2 border border-gray-300 rounded-lg text-gray-900", children: [_jsx("option", { children: "All Categories" }), _jsx("option", { children: "Sales" }), _jsx("option", { children: "Purchases" }), _jsx("option", { children: "Salaries" }), _jsx("option", { children: "Logistics" })] }), _jsxs("select", { className: "px-3 py-2 border border-gray-300 rounded-lg text-gray-900", children: [_jsx("option", { children: "All Types" }), _jsx("option", { children: "Income" }), _jsx("option", { children: "Expense" })] }), _jsxs("select", { className: "px-3 py-2 border border-gray-300 rounded-lg text-gray-900", children: [_jsx("option", { children: "All Statuses" }), _jsx("option", { children: "Completed" }), _jsx("option", { children: "Pending" }), _jsx("option", { children: "Failed" })] })] }), _jsx(Widget, { title: "Transaction History", children: _jsx(Table, { columns: columns, data: transactions, loading: loading }) })] }) }));
}
