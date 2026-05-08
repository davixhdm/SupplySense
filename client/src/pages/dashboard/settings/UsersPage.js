import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { Widget } from '../../../components/dashboard/Widget';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { AlertBanner } from '../../../components/common/AlertBanner';
import { Users, Plus, Trash2, Edit2, Mail, Shield } from 'lucide-react';
export default function UsersPage() {
    const [users, setUsers] = useState([
        {
            id: '1',
            name: 'John Admin',
            email: 'john@supplysense.com',
            role: 'admin',
            status: 'active',
            joinDate: '2025-01-15',
            lastLogin: '5 minutes ago',
        },
        {
            id: '2',
            name: 'Sarah Manager',
            email: 'sarah@supplysense.com',
            role: 'manager',
            status: 'active',
            joinDate: '2025-02-01',
            lastLogin: '2 hours ago',
        },
        {
            id: '3',
            name: 'Mike User',
            email: 'mike@supplysense.com',
            role: 'user',
            status: 'active',
            joinDate: '2025-03-10',
            lastLogin: '1 day ago',
        },
    ]);
    const [showAddUser, setShowAddUser] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [saved, setSaved] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', role: 'user' });
    const handleAddUser = async (e) => {
        e.preventDefault();
        if (newUser.name && newUser.email && newUser.role) {
            const user = {
                id: Date.now().toString(),
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                status: 'active',
                joinDate: new Date().toISOString().split('T')[0],
                lastLogin: 'Never',
            };
            setUsers([...users, user]);
            setNewUser({ name: '', email: '', role: 'user' });
            setShowAddUser(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }
    };
    const handleDeleteUser = (userId) => {
        if (users.filter((u) => u.role === 'admin').length === 1 && users.find((u) => u.id === userId)?.role === 'admin') {
            alert('Cannot delete the last admin user');
            return;
        }
        setUsers(users.filter((u) => u.id !== userId));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };
    const handleToggleStatus = (userId) => {
        setUsers(users.map((u) => u.id === userId
            ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' }
            : u));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };
    const handleChangeRole = (userId, newRole) => {
        setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };
    return (_jsx(DashboardLayout, { children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Manage Users" }), _jsx("p", { className: "text-gray-600 mt-1", children: "Control user access and permissions for your team" })] }), saved && (_jsx(AlertBanner, { type: "success", message: "User settings updated successfully" })), _jsx(Widget, { title: "Add New User", children: !showAddUser ? (_jsxs(Button, { onClick: () => setShowAddUser(true), className: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2", children: [_jsx(Plus, { className: "w-4 h-4" }), "Invite User"] })) : (_jsxs("form", { onSubmit: handleAddUser, className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsx(Input, { label: "Full Name", type: "text", placeholder: "John Doe", value: newUser.name, onChange: (e) => setNewUser({ ...newUser, name: e.target.value }) }), _jsx(Input, { label: "Email", type: "email", placeholder: "john@company.com", value: newUser.email, onChange: (e) => setNewUser({ ...newUser, email: e.target.value }) }), _jsxs("select", { value: newUser.role, onChange: (e) => setNewUser({ ...newUser, role: e.target.value }), className: "px-3 py-2 border border-gray-300 rounded-lg text-gray-900", children: [_jsx("option", { value: "user", children: "User" }), _jsx("option", { value: "manager", children: "Manager" }), _jsx("option", { value: "admin", children: "Admin" })] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { type: "submit", className: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg", children: "Send Invite" }), _jsx("button", { type: "button", onClick: () => setShowAddUser(false), className: "bg-gray-300 hover:bg-gray-400 text-gray-900 px-4 py-2 rounded-lg", children: "Cancel" })] })] })) }), _jsx(Widget, { title: "Team Members", icon: _jsx(Users, { className: "w-5 h-5" }), children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-50 border-b border-gray-200", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-3 text-left text-sm font-semibold text-gray-700", children: "Name" }), _jsx("th", { className: "px-4 py-3 text-left text-sm font-semibold text-gray-700", children: "Email" }), _jsx("th", { className: "px-4 py-3 text-left text-sm font-semibold text-gray-700", children: "Role" }), _jsx("th", { className: "px-4 py-3 text-left text-sm font-semibold text-gray-700", children: "Status" }), _jsx("th", { className: "px-4 py-3 text-left text-sm font-semibold text-gray-700", children: "Last Login" }), _jsx("th", { className: "px-4 py-3 text-left text-sm font-semibold text-gray-700", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-200", children: users.map((user) => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-4 py-3 text-sm font-medium text-gray-900", children: user.name }), _jsxs("td", { className: "px-4 py-3 text-sm text-gray-600 flex items-center gap-2", children: [_jsx(Mail, { className: "w-4 h-4 text-gray-400" }), user.email] }), _jsx("td", { className: "px-4 py-3 text-sm", children: _jsxs("select", { value: user.role, onChange: (e) => handleChangeRole(user.id, e.target.value), className: "px-2 py-1 border border-gray-300 rounded text-sm text-gray-900 bg-white", children: [_jsx("option", { value: "user", children: "User" }), _jsx("option", { value: "manager", children: "Manager" }), _jsx("option", { value: "admin", children: "Admin" })] }) }), _jsx("td", { className: "px-4 py-3 text-sm", children: _jsx("button", { onClick: () => handleToggleStatus(user.id), className: `px-3 py-1 rounded-full text-xs font-medium cursor-pointer ${user.status === 'active'
                                                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`, children: user.status }) }), _jsx("td", { className: "px-4 py-3 text-sm text-gray-600", children: user.lastLogin }), _jsxs("td", { className: "px-4 py-3 text-sm space-x-2 flex", children: [_jsx("button", { className: "text-blue-600 hover:text-blue-800", children: _jsx(Edit2, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => handleDeleteUser(user.id), className: "text-red-600 hover:text-red-800", children: _jsx(Trash2, { className: "w-4 h-4" }) })] })] }, user.id))) })] }) }) }), _jsx(Widget, { title: "User Roles & Permissions", icon: _jsx(Shield, { className: "w-5 h-5" }), children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "border border-gray-200 rounded-lg p-4", children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-2", children: "Admin" }), _jsxs("ul", { className: "text-sm text-gray-600 space-y-1", children: [_jsx("li", { children: "\u2713 Full system access" }), _jsx("li", { children: "\u2713 Manage users" }), _jsx("li", { children: "\u2713 Configure settings" }), _jsx("li", { children: "\u2713 View analytics" }), _jsx("li", { children: "\u2713 Manage backups" })] })] }), _jsxs("div", { className: "border border-gray-200 rounded-lg p-4", children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-2", children: "Manager" }), _jsxs("ul", { className: "text-sm text-gray-600 space-y-1", children: [_jsx("li", { children: "\u2713 View all data" }), _jsx("li", { children: "\u2713 Manage inventory" }), _jsx("li", { children: "\u2713 Manage orders" }), _jsx("li", { children: "\u2717 Manage users" }), _jsx("li", { children: "\u2717 Access settings" })] })] }), _jsxs("div", { className: "border border-gray-200 rounded-lg p-4", children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-2", children: "User" }), _jsxs("ul", { className: "text-sm text-gray-600 space-y-1", children: [_jsx("li", { children: "\u2713 View dashboard" }), _jsx("li", { children: "\u2713 Create orders" }), _jsx("li", { children: "\u2713 View assigned data" }), _jsx("li", { children: "\u2717 Manage users" }), _jsx("li", { children: "\u2717 Access settings" })] })] })] }) })] }) }));
}
