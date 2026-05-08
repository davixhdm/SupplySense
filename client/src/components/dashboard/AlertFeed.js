import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AlertCircle, CheckCircle, Info } from 'lucide-react';
export function AlertFeed({ alerts = [], loading = false }) {
    const getIcon = (type) => {
        switch (type) {
            case 'error':
                return _jsx(AlertCircle, { size: 20, className: "text-red-600" });
            case 'warning':
                return _jsx(AlertCircle, { size: 20, className: "text-yellow-600" });
            case 'success':
                return _jsx(CheckCircle, { size: 20, className: "text-green-600" });
            default:
                return _jsx(Info, { size: 20, className: "text-blue-600" });
        }
    };
    const getColor = (type) => {
        switch (type) {
            case 'error':
                return 'bg-red-50 border-red-200';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200';
            case 'success':
                return 'bg-green-50 border-green-200';
            default:
                return 'bg-blue-50 border-blue-200';
        }
    };
    return (_jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Recent Alerts" }), loading ? (_jsx("div", { className: "text-center py-8 text-gray-500", children: "Loading alerts..." })) : alerts.length === 0 ? (_jsx("div", { className: "text-center py-8 text-gray-500", children: "No alerts at the moment" })) : (_jsx("div", { className: "space-y-3", children: alerts.slice(0, 5).map((alert) => (_jsx("div", { className: `border rounded-lg p-4 ${getColor(alert.type)}`, children: _jsxs("div", { className: "flex items-start gap-3", children: [getIcon(alert.type), _jsxs("div", { className: "flex-1", children: [_jsx("h4", { className: "font-semibold text-gray-900", children: alert.title }), _jsx("p", { className: "text-sm text-gray-600 mt-1", children: alert.message }), _jsx("p", { className: "text-xs text-gray-500 mt-2", children: alert.timestamp.toLocaleString() })] })] }) }, alert.id))) }))] }));
}
