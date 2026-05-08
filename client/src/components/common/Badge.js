import { jsx as _jsx } from "react/jsx-runtime";
export function Badge({ children, variant = 'primary', size = 'md', className = '', }) {
    const baseStyles = 'font-medium rounded-full inline-flex items-center justify-center whitespace-nowrap';
    const variants = {
        primary: 'bg-blue-100 text-blue-800',
        secondary: 'bg-gray-100 text-gray-800',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        danger: 'bg-red-100 text-red-800',
        info: 'bg-cyan-100 text-cyan-800',
    };
    const sizes = {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-2 text-base',
    };
    return (_jsx("span", { className: `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`, children: children }));
}
