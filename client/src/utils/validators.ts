/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate password strength
 * Requires: at least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
 */
export const isValidPassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  return passwordRegex.test(password)
}

/**
 * Get password strength score (0-5)
 */
export const getPasswordStrength = (password: string): number => {
  let strength = 0

  if (password.length >= 8) strength++
  if (password.length >= 12) strength++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
  if (/\d/.test(password)) strength++
  if (/[@$!%*?&]/.test(password)) strength++

  return Math.min(strength, 5)
}

/**
 * Validate phone number (US format)
 */
export const isValidPhoneUS = (phone: string): boolean => {
  const phoneRegex = /^(\+?1)?[-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/
  return phoneRegex.test(phone)
}

/**
 * Validate URL
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Validate credit card number (Luhn algorithm)
 */
export const isValidCreditCard = (cardNumber: string): boolean => {
  const digits = cardNumber.replace(/\D/g, '')
  if (digits.length < 13 || digits.length > 19) return false

  let sum = 0
  let isEven = false

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10)

    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }

    sum += digit
    isEven = !isEven
  }

  return sum % 10 === 0
}

/**
 * Validate date format
 */
export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString)
  return date instanceof Date && !isNaN(date.getTime())
}

/**
 * Validate file size
 */
export const isValidFileSize = (fileSizeBytes: number, maxSizeMB: number): boolean => {
  return fileSizeBytes <= maxSizeMB * 1024 * 1024
}

/**
 * Validate file type
 */
export const isValidFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type)
}

/**
 * Validate required field
 */
export const isRequired = (value: any): boolean => {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  return true
}

/**
 * Validate minimum length
 */
export const minLength = (value: string, length: number): boolean => {
  return value.length >= length
}

/**
 * Validate maximum length
 */
export const maxLength = (value: string, length: number): boolean => {
  return value.length <= length
}

/**
 * Validate value is between min and max
 */
export const isBetween = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max
}

/**
 * Validate string matches pattern
 */
export const matchesPattern = (value: string, pattern: RegExp): boolean => {
  return pattern.test(value)
}

/**
 * Validate all fields in object
 */
export const validateFields = (
  fields: Record<string, any>,
  rules: Record<string, (value: any) => boolean>
): Record<string, boolean> => {
  const errors: Record<string, boolean> = {}

  Object.entries(rules).forEach(([field, validator]) => {
    if (!validator(fields[field])) {
      errors[field] = true
    }
  })

  return errors
}

/**
 * Form validation helper
 */
export interface ValidationRule {
  required?: boolean
  email?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => boolean
}

export interface ValidationRules {
  [key: string]: ValidationRule
}

export interface ValidationErrors {
  [key: string]: string
}

export const validateForm = (data: Record<string, any>, rules: ValidationRules): ValidationErrors => {
  const errors: ValidationErrors = {}

  Object.entries(rules).forEach(([field, rule]) => {
    const value = data[field]

    if (rule.required && !isRequired(value)) {
      errors[field] = `${field} is required`
      return
    }

    if (value) {
      if (rule.email && !isValidEmail(value)) {
        errors[field] = 'Invalid email format'
      }

      if (rule.minLength && !minLength(value, rule.minLength)) {
        errors[field] = `Minimum length is ${rule.minLength}`
      }

      if (rule.maxLength && !maxLength(value, rule.maxLength)) {
        errors[field] = `Maximum length is ${rule.maxLength}`
      }

      if (rule.pattern && !matchesPattern(value, rule.pattern)) {
        errors[field] = 'Invalid format'
      }

      if (rule.custom && !rule.custom(value)) {
        errors[field] = 'Validation failed'
      }
    }
  })

  return errors
}
