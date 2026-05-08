import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Widget } from '../../components/dashboard/Widget';
import { Table } from '../../components/common/Table';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Mail, Phone } from 'lucide-react';
export default function EmployeesPage() {
    const [employees, setEmployees] = useState([
        {
            id: '1',
            name: 'John Smith',
            email: 'john.smith@supplysense.com',
            department: 'Operations',
            position: 'Operations Manager',
            joinDate: '2022-03-15',
            status: 'active',
            phone: '+1-555-0101',
        },
        {
            id: '2',
            name: 'Sarah Johnson',
            email: 'sarah.johnson@supplysense.com',
            department: 'Supply Chain',
            position: 'Logistics Specialist',
            joinDate: '2023-01-10',
            status: 'active',
            phone: '+1-555-0102',
        },
        {
            id: '3',
            name: 'Michael Chen',
            email: 'michael.chen@supplysense.com',
            department: 'Inventory',
            position: 'Inventory Controller',
            joinDate: '2023-06-20',
            status: 'on-leave',
            phone: '+1-555-0103',
        },
        {
            id: '4',
            name: 'Emma Rodriguez',
            email: 'emma.rodriguez@supplysense.com',
            department: 'Finance',
            position: 'Financial Analyst',
            joinDate: '2021-11-05',
            status: 'active',
            phone: '+1-555-0104',
        },
    ]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const getStatusColor = (status) => {
        const colors = {
            active: 'bg-green-100 text-green-800',
            'on-leave': 'bg-yellow-100 text-yellow-800',
            inactive: 'bg-gray-100 text-gray-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };
    const columns = [
        { key: 'name', label: 'Name' },
        {
            key: 'email',
            label: 'Email',
            render: (val) => (_jsxs("a", { href: `mailto:${val}`, className: "text-blue-600 hover:underline flex items-center gap-1", children: [_jsx(Mail, { className: "w-4 h-4" }), val] })),
        },
        { key: 'department', label: 'Department' },
        { key: 'position', label: 'Position' },
        {
            key: 'phone',
            label: 'Phone',
            render: (val) => (_jsxs("a", { href: `tel:${val}`, className: "text-blue-600 hover:underline flex items-center gap-1", children: [_jsx(Phone, { className: "w-4 h-4" }), val] })),
        },
        { key: 'joinDate', label: 'Join Date' },
        {
            key: 'status',
            label: 'Status',
            render: (val) => (_jsx("span", { className: `px-2 py-1 rounded text-sm font-medium ${getStatusColor(val)}`, children: val })),
        },
    ];
    const activeCount = employees.filter((e) => e.status === 'active').length;
    const onLeaveCount = employees.filter((e) => e.status === 'on-leave').length;
    return (_jsx(DashboardLayout, { children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Employees" }), _jsx(Button, { onClick: () => { }, children: "Add Employee" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsxs(Widget, { title: "Total Employees", children: [_jsx("p", { className: "text-4xl font-bold text-gray-900", children: employees.length }), _jsx("p", { className: "text-sm text-gray-600 mt-2", children: "Team members" })] }), _jsxs(Widget, { title: "Active", children: [_jsx("p", { className: "text-4xl font-bold text-green-600", children: activeCount }), _jsx("p", { className: "text-sm text-gray-600 mt-2", children: "Working now" })] }), _jsxs(Widget, { title: "On Leave", children: [_jsx("p", { className: "text-4xl font-bold text-yellow-600", children: onLeaveCount }), _jsx("p", { className: "text-sm text-gray-600 mt-2", children: "Currently away" })] }), _jsxs(Widget, { title: "Departments", children: [_jsx("p", { className: "text-4xl font-bold text-blue-600", children: "4" }), _jsx("p", { className: "text-sm text-gray-600 mt-2", children: "Across company" })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsx(Input, { label: "Search Employees", type: "text", placeholder: "Name, email, phone...", value: search, onChange: (e) => setSearch(e.target.value) }), _jsxs("select", { className: "px-3 py-2 border border-gray-300 rounded-lg text-gray-900", children: [_jsx("option", { children: "All Departments" }), _jsx("option", { children: "Operations" }), _jsx("option", { children: "Supply Chain" }), _jsx("option", { children: "Inventory" }), _jsx("option", { children: "Finance" })] }), _jsxs("select", { className: "px-3 py-2 border border-gray-300 rounded-lg text-gray-900", children: [_jsx("option", { children: "All Statuses" }), _jsx("option", { children: "Active" }), _jsx("option", { children: "On Leave" }), _jsx("option", { children: "Inactive" })] })] }), _jsx(Widget, { title: "Team Members", children: _jsx(Table, { columns: columns, data: employees, loading: loading }) })] }) }));
}
