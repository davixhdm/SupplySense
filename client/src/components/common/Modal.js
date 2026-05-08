import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { X } from 'lucide-react';
export function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen)
        return null;
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-white rounded-lg shadow-lg max-w-md w-full mx-4", children: [_jsxs("div", { className: "flex justify-between items-center p-6 border-b", children: [_jsx("h2", { className: "text-xl font-semibold", children: title }), _jsx("button", { onClick: onClose, className: "text-gray-500 hover:text-gray-700", children: _jsx(X, { size: 24 }) })] }), _jsx("div", { className: "p-6", children: children })] }) }));
}
