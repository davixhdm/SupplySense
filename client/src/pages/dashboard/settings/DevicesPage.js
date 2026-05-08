import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { Widget } from '../../../components/dashboard/Widget';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { AlertBanner } from '../../../components/common/AlertBanner';
import { Smartphone, Trash2, Plus, Shield } from 'lucide-react';
export default function DevicesPage() {
    const [devices, setDevices] = useState([
        {
            id: '1',
            name: 'MacBook Pro',
            type: 'Laptop',
            os: 'macOS 14.0',
            lastActive: '5 minutes ago',
            status: 'active',
            ipAddress: '192.168.1.100',
        },
        {
            id: '2',
            name: 'iPhone 14',
            type: 'Mobile',
            os: 'iOS 17.0',
            lastActive: '2 hours ago',
            status: 'inactive',
            ipAddress: '192.168.1.105',
        },
        {
            id: '3',
            name: 'Windows Desktop',
            type: 'Desktop',
            os: 'Windows 11',
            lastActive: '1 day ago',
            status: 'inactive',
            ipAddress: '192.168.1.110',
        },
    ]);
    const [showAddDevice, setShowAddDevice] = useState(false);
    const [newDevice, setNewDevice] = useState({ name: '', type: '', os: '' });
    const [saved, setSaved] = useState(false);
    const handleAddDevice = async (e) => {
        e.preventDefault();
        if (newDevice.name && newDevice.type && newDevice.os) {
            const device = {
                id: Date.now().toString(),
                name: newDevice.name,
                type: newDevice.type,
                os: newDevice.os,
                lastActive: 'Just now',
                status: 'active',
                ipAddress: '192.168.1.' + Math.floor(Math.random() * 255),
            };
            setDevices([...devices, device]);
            setNewDevice({ name: '', type: '', os: '' });
            setShowAddDevice(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }
    };
    const handleRemoveDevice = (deviceId) => {
        setDevices(devices.filter((d) => d.id !== deviceId));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };
    const handleLogoutDevice = (deviceId) => {
        setDevices(devices.map((d) => d.id === deviceId ? { ...d, status: 'inactive', lastActive: 'just logged out' } : d));
    };
    return (_jsx(DashboardLayout, { children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Manage Devices" }), _jsx("p", { className: "text-gray-600 mt-1", children: "View and manage devices accessing your account" })] }), saved && (_jsx(AlertBanner, { type: "success", message: "Device settings updated successfully" })), _jsx(Widget, { title: "Add New Device", children: !showAddDevice ? (_jsxs(Button, { onClick: () => setShowAddDevice(true), className: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2", children: [_jsx(Plus, { className: "w-4 h-4" }), "Add Device"] })) : (_jsxs("form", { onSubmit: handleAddDevice, className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsx(Input, { label: "Device Name", type: "text", placeholder: "e.g., My iPhone", value: newDevice.name, onChange: (e) => setNewDevice({ ...newDevice, name: e.target.value }) }), _jsxs("select", { value: newDevice.type, onChange: (e) => setNewDevice({ ...newDevice, type: e.target.value }), className: "px-3 py-2 border border-gray-300 rounded-lg text-gray-900", children: [_jsx("option", { value: "", children: "Select Type" }), _jsx("option", { value: "Laptop", children: "Laptop" }), _jsx("option", { value: "Desktop", children: "Desktop" }), _jsx("option", { value: "Mobile", children: "Mobile" }), _jsx("option", { value: "Tablet", children: "Tablet" })] }), _jsx(Input, { label: "Operating System", type: "text", placeholder: "e.g., iOS 17.0", value: newDevice.os, onChange: (e) => setNewDevice({ ...newDevice, os: e.target.value }) })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { type: "submit", className: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg", children: "Add Device" }), _jsx("button", { type: "button", onClick: () => setShowAddDevice(false), className: "bg-gray-300 hover:bg-gray-400 text-gray-900 px-4 py-2 rounded-lg", children: "Cancel" })] })] })) }), _jsx(Widget, { title: "Your Devices", icon: _jsx(Smartphone, { className: "w-5 h-5" }), children: _jsx("div", { className: "space-y-3", children: devices.map((device) => (_jsxs("div", { className: "flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50", children: [_jsx("div", { className: "flex-1", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Smartphone, { className: "w-5 h-5 text-gray-600" }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-gray-900", children: device.name }), _jsxs("p", { className: "text-sm text-gray-600", children: [device.type, " \u2022 ", device.os, " \u2022 ", device.ipAddress] }), _jsxs("p", { className: "text-xs text-gray-500", children: ["Last active: ", device.lastActive] })] })] }) }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: `px-3 py-1 rounded-full text-xs font-medium ${device.status === 'active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-700'}`, children: device.status }), device.status === 'active' && (_jsx("button", { onClick: () => handleLogoutDevice(device.id), className: "text-orange-600 hover:text-orange-800 text-sm font-medium", children: "Logout" })), _jsx("button", { onClick: () => handleRemoveDevice(device.id), className: "text-red-600 hover:text-red-800", children: _jsx(Trash2, { className: "w-4 h-4" }) })] })] }, device.id))) }) }), _jsx(Widget, { title: "Security", icon: _jsx(Shield, { className: "w-5 h-5" }), children: _jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-4", children: _jsxs("p", { className: "text-sm text-gray-700", children: [_jsx("strong", { children: "Tip:" }), " Review your active devices regularly. Remove any devices you no longer recognize or use."] }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "border border-gray-200 rounded-lg p-4", children: [_jsx("p", { className: "font-medium text-gray-900", children: "Active Devices" }), _jsx("p", { className: "text-2xl font-bold text-blue-600 mt-2", children: devices.filter((d) => d.status === 'active').length })] }), _jsxs("div", { className: "border border-gray-200 rounded-lg p-4", children: [_jsx("p", { className: "font-medium text-gray-900", children: "Total Devices" }), _jsx("p", { className: "text-2xl font-bold text-gray-600 mt-2", children: devices.length })] })] })] }) })] }) }));
}
