// Application constants
export const APP_NAME = 'SupplySense';
export const APP_VERSION = '1.0.0';
// API configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const API_TIMEOUT = 30000; // 30 seconds
// Pagination defaults
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;
export const DEFAULT_ALERT_LIMIT = 50;
// User roles
export const USER_ROLES = {
    ADMIN: 'admin',
    MANAGER: 'manager',
    USER: 'user',
};
// Order statuses
export const ORDER_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
};
export const ORDER_STATUS_COLORS = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
};
// Risk prediction levels
export const RISK_LEVELS = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
};
export const RISK_LEVEL_COLORS = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
};
// Alert types
export const ALERT_TYPES = {
    WARNING: 'warning',
    ERROR: 'error',
    INFO: 'info',
    SUCCESS: 'success',
};
export const ALERT_TYPE_COLORS = {
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    error: 'bg-red-100 text-red-800 border-red-300',
    info: 'bg-blue-100 text-blue-800 border-blue-300',
    success: 'bg-green-100 text-green-800 border-green-300',
};
// Transaction types
export const TRANSACTION_TYPES = {
    INCOME: 'income',
    EXPENSE: 'expense',
};
// Button sizes
export const BUTTON_SIZES = {
    SM: 'sm',
    MD: 'md',
    LG: 'lg',
};
// Button variants
export const BUTTON_VARIANTS = {
    PRIMARY: 'primary',
    SECONDARY: 'secondary',
    DANGER: 'danger',
};
// Badge variants
export const BADGE_VARIANTS = {
    PRIMARY: 'primary',
    SECONDARY: 'secondary',
    SUCCESS: 'success',
    WARNING: 'warning',
    DANGER: 'danger',
    INFO: 'info',
};
// Local storage keys
export const STORAGE_KEYS = {
    TOKEN: 'token',
    USER: 'user',
    PREFERENCES: 'preferences',
    THEME: 'theme',
};
// Date/Time formats
export const DATE_FORMATS = {
    SHORT: 'MM/dd/yyyy',
    LONG: 'MMMM d, yyyy',
    FULL: 'EEEE, MMMM d, yyyy',
    TIME: 'hh:mm a',
    DATETIME: 'MM/dd/yyyy hh:mm a',
};
// Route paths
export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    LICENSE: '/license',
    DASHBOARD: '/dashboard',
    ORDERS: '/dashboard/orders',
    INVENTORY: '/dashboard/inventory',
    CUSTOMERS: '/dashboard/customers',
    SUPPLIERS: '/dashboard/suppliers',
    EMPLOYEES: '/dashboard/employees',
    TRANSACTIONS: '/dashboard/transactions',
    AI_INSIGHTS: '/dashboard/ai-insights',
    ALERTS: '/dashboard/alerts',
    SETTINGS: '/dashboard/settings',
    SETTINGS_COMPANY: '/dashboard/settings/company',
    SETTINGS_PREFERENCES: '/dashboard/settings/preferences',
    SETTINGS_USERS: '/dashboard/settings/users',
    SETTINGS_DEVICES: '/dashboard/settings/devices',
    SETTINGS_BACKUPS: '/dashboard/settings/backups',
};
