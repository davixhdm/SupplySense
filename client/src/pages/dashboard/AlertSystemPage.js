import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Widget } from '../../components/dashboard/Widget';
import { Table } from '../../components/common/Table';
import { Button } from '../../components/common/Button';
import { AlertCircle, Bell, CheckCircle } from 'lucide-react';
export default function AlertSystemPage() {
    const [alerts, setAlerts] = useState([
        {
            id: '1',
            title: 'Critical Low Inventory',
            type: 'error',
            description: 'SKU-001 has fallen below critical level',
            severity: 'critical',
            createdAt: '2024-01-18T14:30:00',
            resolved: false,
        },
        {
            id: '2',
            title: 'Supplier Delay',
            type: 'warning',
            description: 'Supplier ABC has delayed shipment by 2 days',
            severity: 'high',
            createdAt: '2024-01-18T10:15:00',
            resolved: false,
        },
        {
            id: '3',
            title: 'High Churn Risk Customer',
            type: 'warning',
            description: 'Customer XYZ shows high churn risk score',
            severity: 'medium',
            createdAt: '2024-01-17T16:45:00',
            resolved: true,
        },
    ]);
    const [settings, setSettings] = useState([
        {
            id: '1',
            name: 'Inventory Alerts',
            enabled: true,
            channels: ['email', 'in-app'],
            threshold: 50,
        },
        {
            id: '2',
            name: 'Supplier Notifications',
            enabled: true,
            channels: ['email', 'sms', 'in-app'],
        },
        {
            id: '3',
            name: 'Customer Risk Alerts',
            enabled: false,
            channels: ['email'],
        },
        {
            id: '4',
            name: 'System Warnings',
            enabled: true,
            channels: ['in-app'],
        },
    ]);
    const [loading, setLoading] = useState(false);
    const getSeverityColor = (severity) => {
        const colors = {
            critical: 'bg-red-100 text-red-800',
            high: 'bg-orange-100 text-orange-800',
            medium: 'bg-yellow-100 text-yellow-800',
            low: 'bg-green-100 text-green-800',
        };
        return colors[severity] || 'bg-gray-100 text-gray-800';
    };
    const getTypeIcon = (type) => {
        const icons = {
            error: _jsx(AlertCircle, { className: "w-5 h-5 text-red-600" }),
            warning: _jsx(AlertCircle, { className: "w-5 h-5 text-yellow-600" }),
            info: _jsx(Bell, { className: "w-5 h-5 text-blue-600" }),
            success: _jsx(CheckCircle, { className: "w-5 h-5 text-green-600" }),
        };
        return icons[type];
    };
    const handleResolveAlert = (alertId) => {
        setAlerts((prev) => prev.map((alert) => alert.id === alertId ? { ...alert, resolved: true } : alert));
    };
    const handleToggleSetting = (settingId) => {
        setSettings((prev) => prev.map((setting) => setting.id === settingId ? { ...setting, enabled: !setting.enabled } : setting));
    };
    const activeAlerts = alerts.filter((a) => !a.resolved);
    const criticalAlerts = alerts.filter((a) => a.severity === 'critical' && !a.resolved);
    const columns = [
        {
            key: 'title',
            label: 'Alert',
            render: (val, item) => (_jsxs("div", { className: "flex items-start gap-2", children: [getTypeIcon(item.type), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-gray-900", children: val }), _jsx("p", { className: "text-sm text-gray-600", children: item.description })] })] })),
        },
        {
            key: 'severity',
            label: 'Severity',
            render: (val) => (_jsx("span", { className: `px-2 py-1 rounded text-sm font-medium ${getSeverityColor(val)}`, children: val })),
        },
        { key: 'createdAt', label: 'Time', render: (val) => new Date(val).toLocaleString() },
        {
            key: 'resolved',
            label: 'Action',
            render: (val, item) => !val ? (_jsx(Button, { size: "sm", onClick: () => handleResolveAlert(item.id), children: "Resolve" })) : (_jsx("span", { className: "text-green-600 font-medium", children: "Resolved" })),
        },
    ];
    return (_jsx(DashboardLayout, { children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Alert System" }), _jsx("p", { className: "text-gray-600 mt-1", children: "Manage your supply chain alerts and notifications" })] }), criticalAlerts.length > 0 && (_jsx("div", { className: "bg-red-50 border-l-4 border-red-600 rounded-lg p-4", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx(AlertCircle, { className: "w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" }), _jsxs("div", { children: [_jsx("h3", { className: "font-bold text-red-900 text-lg", children: "Critical Alerts" }), _jsxs("p", { className: "text-red-700 text-sm mt-1", children: ["You have ", criticalAlerts.length, " critical alert(s) requiring immediate attention."] })] })] }) })), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsxs(Widget, { title: "Total Alerts", children: [_jsx("p", { className: "text-4xl font-bold text-gray-900", children: alerts.length }), _jsx("p", { className: "text-sm text-gray-600 mt-2", children: "All time" })] }), _jsxs(Widget, { title: "Active Alerts", children: [_jsx("p", { className: "text-4xl font-bold text-orange-600", children: activeAlerts.length }), _jsx("p", { className: "text-sm text-gray-600 mt-2", children: "Unresolved" })] }), _jsxs(Widget, { title: "Critical", children: [_jsx("p", { className: "text-4xl font-bold text-red-600", children: criticalAlerts.length }), _jsx("p", { className: "text-sm text-gray-600 mt-2", children: "Need action" })] }), _jsxs(Widget, { title: "Resolved", children: [_jsx("p", { className: "text-4xl font-bold text-green-600", children: alerts.filter((a) => a.resolved).length }), _jsx("p", { className: "text-sm text-gray-600 mt-2", children: "Completed" })] })] }), _jsx(Widget, { title: "Recent Alerts", children: _jsx(Table, { columns: columns, data: activeAlerts, loading: loading }) }), _jsx(Widget, { title: "Notification Settings", children: _jsx("div", { className: "space-y-4", children: settings.map((setting) => (_jsxs("div", { className: "flex items-center justify-between p-4 border border-gray-200 rounded-lg", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h4", { className: "font-semibold text-gray-900", children: setting.name }), _jsxs("p", { className: "text-sm text-gray-600 mt-1", children: ["Channels: ", setting.channels.join(', '), setting.threshold && ` • Threshold: ${setting.threshold}`] })] }), _jsx("button", { onClick: () => handleToggleSetting(setting.id), className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${setting.enabled ? 'bg-blue-600' : 'bg-gray-300'}`, children: _jsx("span", { className: `inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${setting.enabled ? 'translate-x-6' : 'translate-x-1'}` }) })] }, setting.id))) }) })] }) }));
}
