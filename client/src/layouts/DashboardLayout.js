import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Sidebar } from '../components/dashboard/Sidebar';
import { Topbar } from '../components/dashboard/Topbar';
export function DashboardLayout({ children }) {
    return (_jsxs("div", { children: [_jsx(Sidebar, {}), _jsxs("div", { className: "ml-64", children: [_jsx(Topbar, {}), _jsx("main", { className: "p-8", children: children })] })] }));
}
