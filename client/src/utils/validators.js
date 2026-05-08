/**
 * Validate email format
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
/**
 * Validate password strength
 * Requires: at least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
 */
export const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};
/**
 * Get password strength score (0-5)
 */
export const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8)
        strength++;
    if (password.length >= 12)
        strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password))
        strength++;
    if (/\d/.test(password))
        strength++;
    if (/[@$!%*?&]/.test(password))
        strength++;
    return Math.min(strength, 5);
};
/**
 * Validate phone number (US format)
 */
export const isValidPhoneUS = (phone) => {
    const phoneRegex = /^(\+?1)?[-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
    return phoneRegex.test(phone);
};
/**
 * Validate URL
 */
export const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    }
    catch {
        return false;
    }
};
/**
 * Validate credit card number (Luhn algorithm)
 */
export const isValidCreditCard = (cardNumber) => {
    const digits = cardNumber.replace(/\D/g, '');
    if (digits.length < 13 || digits.length > 19)
        return false;
    let sum = 0;
    let isEven = false;
    for (let i = digits.length - 1; i >= 0; i--) {
        let digit = parseInt(digits[i], 10);
        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        sum += digit;
        isEven = !isEven;
    }
    return sum % 10 === 0;
};
/**
 * Validate date format
 */
export const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
};
/**
 * Validate file size
 */
export const isValidFileSize = (fileSizeBytes, maxSizeMB) => {
    return fileSizeBytes <= maxSizeMB * 1024 * 1024;
};
/**
 * Validate file type
 */
export const isValidFileType = (file, allowedTypes) => {
    return allowedTypes.includes(file.type);
};
/**
 * Validate required field
 */
export const isRequired = (value) => {
    if (value === null || value === undefined)
        return false;
    if (typeof value === 'string')
        return value.trim().length > 0;
    if (Array.isArray(value))
        return value.length > 0;
    return true;
};
/**
 * Validate minimum length
 */
export const minLength = (value, length) => {
    return value.length >= length;
};
/**
 * Validate maximum length
 */
export const maxLength = (value, length) => {
    return value.length <= length;
};
/**
 * Validate value is between min and max
 */
export const isBetween = (value, min, max) => {
    return value >= min && value <= max;
};
/**
 * Validate string matches pattern
 */
export const matchesPattern = (value, pattern) => {
    return pattern.test(value);
};
/**
 * Validate all fields in object
 */
export const validateFields = (fields, rules) => {
    const errors = {};
    Object.entries(rules).forEach(([field, validator]) => {
        if (!validator(fields[field])) {
            errors[field] = true;
        }
    });
    return errors;
};
export const validateForm = (data, rules) => {
    const errors = {};
    Object.entries(rules).forEach(([field, rule]) => {
        const value = data[field];
        if (rule.required && !isRequired(value)) {
            errors[field] = `${field} is required`;
            return;
        }
        if (value) {
            if (rule.email && !isValidEmail(value)) {
                errors[field] = 'Invalid email format';
            }
            if (rule.minLength && !minLength(value, rule.minLength)) {
                errors[field] = `Minimum length is ${rule.minLength}`;
            }
            if (rule.maxLength && !maxLength(value, rule.maxLength)) {
                errors[field] = `Maximum length is ${rule.maxLength}`;
            }
            if (rule.pattern && !matchesPattern(value, rule.pattern)) {
                errors[field] = 'Invalid format';
            }
            if (rule.custom && !rule.custom(value)) {
                errors[field] = 'Validation failed';
            }
        }
    });
    return errors;
};
