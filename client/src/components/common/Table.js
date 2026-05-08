import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function Table({ columns, data, loading = false }) {
    if (loading) {
        return _jsx("div", { className: "text-center py-8", children: "Loading..." });
    }
    if (data.length === 0) {
        return _jsx("div", { className: "text-center py-8 text-gray-500", children: "No data available" });
    }
    return (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsx("tr", { className: "bg-gray-100 border-b", children: columns.map((col) => (_jsx("th", { className: "px-6 py-3 text-left text-sm font-semibold", children: col.label }, col.key))) }) }), _jsx("tbody", { children: data.map((row, idx) => (_jsx("tr", { className: "border-b hover:bg-gray-50", children: columns.map((col) => (_jsx("td", { className: "px-6 py-3 text-sm", children: col.render ? col.render(row[col.key]) : String(row[col.key]) }, col.key))) }, idx))) })] }) }));
}
