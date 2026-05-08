import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { X, AlertCircle, CheckCircle, InfoIcon } from 'lucide-react';
export function AlertBanner({ type, message, onClose, dismissible = true }) {
    const styles = {
        success: 'bg-green-50 border-green-200 text-green-800',
        error: 'bg-red-50 border-red-200 text-red-800',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        info: 'bg-blue-50 border-blue-200 text-blue-800',
    };
    const icons = {
        success: _jsx(CheckCircle, { size: 20 }),
        error: _jsx(AlertCircle, { size: 20 }),
        warning: _jsx(AlertCircle, { size: 20 }),
        info: _jsx(InfoIcon, { size: 20 }),
    };
    return (_jsxs("div", { className: `flex items-center gap-3 p-4 rounded-lg border ${styles[type]}`, children: [icons[type], _jsx("span", { className: "flex-1", children: message }), dismissible && (_jsx("button", { onClick: onClose, className: "text-current hover:opacity-70", children: _jsx(X, { size: 20 }) }))] }));
}
