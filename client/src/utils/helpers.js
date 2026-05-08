import { format, parseISO } from 'date-fns';
import { DATE_FORMATS } from './constants';
/**
 * Format a date string to a readable format
 */
export const formatDate = (date, formatType = 'SHORT') => {
    try {
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        return format(dateObj, DATE_FORMATS[formatType]);
    }
    catch {
        return 'Invalid date';
    }
};
/**
 * Format currency values
 */
export const formatCurrency = (value, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(value);
};
/**
 * Format number with thousand separators
 */
export const formatNumber = (value, decimals = 0) => {
    return value.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
};
/**
 * Format percentage
 */
export const formatPercentage = (value, decimals = 0) => {
    return `${value.toFixed(decimals)}%`;
};
/**
 * Truncate text to specified length
 */
export const truncate = (text, length = 50) => {
    if (text.length <= length)
        return text;
    return `${text.slice(0, length)}...`;
};
/**
 * Capitalize first letter of string
 */
export const capitalize = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};
/**
 * Format full name
 */
export const formatName = (firstName, lastName) => {
    return lastName ? `${firstName} ${lastName}` : firstName;
};
/**
 * Format phone number
 */
export const formatPhone = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length !== 10)
        return phone;
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
};
/**
 * Get initials from name
 */
export const getInitials = (name) => {
    return name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};
/**
 * Calculate difference between two dates in days
 */
export const getDaysDifference = (date1, date2 = new Date()) => {
    const d1 = typeof date1 === 'string' ? parseISO(date1) : date1;
    const d2 = typeof date2 === 'string' ? parseISO(date2) : date2;
    const timeDiff = d2.getTime() - d1.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
};
/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
    if (bytes === 0)
        return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};
/**
 * Debounce function
 */
export const debounce = (func, wait) => {
    let timeout = null;
    return function (...args) {
        const later = () => {
            timeout = null;
            func(...args);
        };
        if (timeout)
            clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};
/**
 * Throttle function
 */
export const throttle = (func, limit) => {
    let inThrottle = false;
    return function (...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
    };
};
/**
 * Sleep/delay utility
 */
export const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
/**
 * Deep clone object
 */
export const deepClone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};
/**
 * Merge objects
 */
export const mergeObjects = (target, source) => {
    return { ...target, ...source };
};
/**
 * Get query parameter from URL
 */
export const getQueryParam = (param) => {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
};
/**
 * Build query string from object
 */
export const buildQueryString = (params) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            query.append(key, String(value));
        }
    });
    return query.toString();
};
/**
 * Check if object is empty
 */
export const isEmpty = (obj) => {
    return Object.keys(obj).length === 0;
};
/**
 * Get random item from array
 */
export const randomItem = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
};
/**
 * Shuffle array
 */
export const shuffle = (arr) => {
    const newArr = [...arr];
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
};
