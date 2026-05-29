export const API_URL = (import.meta.env as any).VITE_API_URL || 'http://localhost:5000/api'

export const ADMIN_ROLES = {
  SUPER_ADMIN: 'superadmin',
  MODERATOR: 'moderator'
} as const

export const PLAN_LABELS: Record<string, string> = {
  trial: 'Free Trial',
  standard: 'Standard',
  proplus: 'Pro+'
}

export const BILLING_LABELS: Record<string, string> = {
  monthly: 'Monthly',
  yearly: 'Yearly',
  permanent: 'Permanent',
  trial: 'Trial'
}

export const PAYMENT_METHODS: Record<string, string> = {
  stripe: 'Stripe',
  mpesa_stk: 'M-Pesa STK Push',
  mpesa_send: 'M-Pesa Send Money',
  mpesa_paybill: 'M-Pesa Paybill',
  mpesa_till: 'M-Pesa Till',
  paypal: 'PayPal'
}

export const PAYMENT_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  expired: 'bg-gray-100 text-gray-800'
}

export const CURRENCIES = ['KSh', 'USD', 'EUR', 'GBP'] as const