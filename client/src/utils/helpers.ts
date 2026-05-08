import { format, parseISO } from 'date-fns'
import { DATE_FORMATS } from './constants'

/**
 * Format a date string to a readable format
 */
export const formatDate = (date: string | Date, formatType: keyof typeof DATE_FORMATS = 'SHORT'): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return format(dateObj, DATE_FORMATS[formatType])
  } catch {
    return 'Invalid date'
  }
}

/**
 * Format currency values
 */
export const formatCurrency = (value: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(value)
}

/**
 * Format number with thousand separators
 */
export const formatNumber = (value: number, decimals: number = 0): string => {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

/**
 * Format percentage
 */
export const formatPercentage = (value: number, decimals: number = 0): string => {
  return `${value.toFixed(decimals)}%`
}

/**
 * Truncate text to specified length
 */
export const truncate = (text: string, length: number = 50): string => {
  if (text.length <= length) return text
  return `${text.slice(0, length)}...`
}

/**
 * Capitalize first letter of string
 */
export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

/**
 * Format full name
 */
export const formatName = (firstName: string, lastName?: string): string => {
  return lastName ? `${firstName} ${lastName}` : firstName
}

/**
 * Format phone number
 */
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length !== 10) return phone
  return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
}

/**
 * Get initials from name
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Calculate difference between two dates in days
 */
export const getDaysDifference = (date1: Date | string, date2: Date | string = new Date()): number => {
  const d1 = typeof date1 === 'string' ? parseISO(date1) : date1
  const d2 = typeof date2 === 'string' ? parseISO(date2) : date2
  const timeDiff = d2.getTime() - d1.getTime()
  return Math.ceil(timeDiff / (1000 * 3600 * 24))
}

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null

  return function (...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle function
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean = false

  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

/**
 * Sleep/delay utility
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Deep clone object
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Merge objects
 */
export const mergeObjects = <T extends Record<string, any>>(target: T, source: Partial<T>): T => {
  return { ...target, ...source }
}

/**
 * Get query parameter from URL
 */
export const getQueryParam = (param: string): string | null => {
  const params = new URLSearchParams(window.location.search)
  return params.get(param)
}

/**
 * Build query string from object
 */
export const buildQueryString = (params: Record<string, any>): string => {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      query.append(key, String(value))
    }
  })
  return query.toString()
}

/**
 * Check if object is empty
 */
export const isEmpty = (obj: Record<string, any>): boolean => {
  return Object.keys(obj).length === 0
}

/**
 * Get random item from array
 */
export const randomItem = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)]
}

/**
 * Shuffle array
 */
export const shuffle = <T>(arr: T[]): T[] => {
  const newArr = [...arr]
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]]
  }
  return newArr
}
