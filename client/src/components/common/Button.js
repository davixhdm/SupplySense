import { jsx as _jsx } from "react/jsx-runtime";
export function Button({ children, onClick, type = 'button', variant = 'primary', size = 'md', disabled = false, loading = false, className = '', }) {
    const baseStyles = 'font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
    const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
        danger: 'bg-red-600 text-white hover:bg-red-700',
    };
    const sizes = {
        sm: 'px-3 py-1 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };
    return (_jsx("button", { type: type, onClick: onClick, disabled: disabled || loading, className: `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`, children: loading ? '...' : children }));
}
