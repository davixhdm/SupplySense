// Common types for API responses
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

// Auth types
export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'manager' | 'user'
}

export interface AuthResponse {
  token: string
  user: User
}

export interface LicenseResponse {
  valid: boolean
  expiresAt?: string
}

// Dashboard types
export interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  totalInventory: number
}

export interface Dashboard {
  stats: DashboardStats
  widgets: Widget[]
  alerts: Alert[]
}

// Inventory types
export interface InventoryItem {
  id: string
  name: string
  sku: string
  quantity: number
  reorderLevel: number
  price: number
  category: string
  supplier?: string
  lastUpdated: string
}

// Order types
export interface Order {
  id: string
  orderNumber: string
  customer: string
  amount: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered'
  riskPrediction: 'low' | 'medium' | 'high'
  date: string
}

// Customer types
export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  totalOrders: number
  totalSpent: number
  lastOrderDate: string
}

// Supplier types
export interface Supplier {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  products: string[]
  leadTime: number
  rating: number
}

// Employee types
export interface Employee {
  id: string
  name: string
  email: string
  phone: string
  role: string
  department: string
  joinDate: string
  status: 'active' | 'inactive' | 'leave'
}

// Transaction types
export interface Transaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  category: string
  description: string
  date: string
  status: 'completed' | 'pending' | 'failed'
}

// Alert types
export interface Alert {
  id: string
  type: 'warning' | 'error' | 'info' | 'success'
  title: string
  message: string
  timestamp: string
  read: boolean
}

// Settings types
export interface CompanyInfo {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  industry: string
  website: string
}

export interface UserSettings {
  id: string
  userId: string
  theme: 'light' | 'dark'
  notifications: boolean
  emailNotifications: boolean
  language: string
}

export interface Device {
  id: string
  name: string
  type: string
  lastActive: string
  status: 'active' | 'inactive'
}

export interface Backup {
  id: string
  createdAt: string
  size: string
  status: 'completed' | 'failed' | 'in_progress'
}

// AI Insights types
export interface Insight {
  id: string
  title: string
  description: string
  score: number
  recommendation: string
  timestamp: string
}

export interface Prediction {
  prediction: number | string
  confidence: number
  factors: string[]
}

// Widget types
export interface Widget {
  id: string
  title: string
  type: 'chart' | 'stat' | 'list'
  data: any
}

// Error types
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}
