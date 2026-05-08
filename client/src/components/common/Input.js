import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function Input({ label, type = 'text', placeholder, value, onChange, error, disabled = false, className = '', }) {
    return (_jsxs("div", { className: "w-full", children: [label && (_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: label })), _jsx("input", { type: type, placeholder: placeholder, value: value, onChange: onChange, disabled: disabled, className: `w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${error ? 'border-red-500' : 'border-gray-300'} ${className}` }), error && _jsx("p", { className: "text-red-600 text-sm mt-1", children: error })] }));
}
