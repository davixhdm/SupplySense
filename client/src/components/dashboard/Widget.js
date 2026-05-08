import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function Widget({ title, children, action }) {
    return (_jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: title }), action && (_jsx("button", { onClick: action.onClick, className: "text-sm text-blue-600 hover:text-blue-700 font-medium", children: action.label }))] }), children] }));
}
