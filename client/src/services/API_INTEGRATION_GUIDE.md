# Frontend API Integration Guide

## Overview

The SupplySense frontend is fully prepared to connect to the backend API. All services are typed, documented, and ready for production use.

## API Base URL Configuration

Set the API base URL via environment variable:

```env
# .env (client folder)
VITE_API_URL=http://localhost:5000/api
```

If not set, defaults to `http://localhost:5000/api`

## Service Architecture

### File Structure
```
src/services/
├── api.ts                 # Core API utility with error handling
├── types.ts              # TypeScript interfaces for all data models
├── index.ts              # Barrel export for all services
├── authService.ts        # Authentication endpoints
├── dashboardService.ts   # Dashboard & analytics
├── inventoryService.ts   # Inventory management
├── orderService.ts       # Order management
├── customerService.ts    # Customer management
├── employeeService.ts    # Employee management
├── supplierService.ts    # Supplier management
├── transactionService.ts # Transaction management
├── alertService.ts       # Alert management
├── aiInsightsService.ts  # AI insights & predictions
└── settingsService.ts    # Settings & configuration
```

## Using Services in Components

### Simple Import
```typescript
import { orderService, inventoryService } from '../services'

// Use the service
const orders = await orderService.getOrders()
const inventory = await inventoryService.getInventory()
```

### With Type Safety
```typescript
import { orderService, Order, PaginatedResponse } from '../services'

const response = await orderService.getOrders(1, 20)
// response is typed as PaginatedResponse<Order>
```

## Available Services & Endpoints

### Authentication (`authService`)
```typescript
authService.login(email, password) -> Promise<AuthResponse>
authService.register(email, password, name) -> Promise<AuthResponse>
authService.logout() -> Promise<void>
authService.validateLicense(licenseKey) -> Promise<LicenseResponse>
authService.getProfile() -> Promise<User>
authService.updateProfile(updates) -> Promise<User>
```

**Backend Endpoints:**
- `POST /auth/login`
- `POST /auth/register`
- `POST /auth/logout`
- `POST /auth/validate-license`
- `GET /auth/profile`
- `PUT /auth/profile`

### Dashboard (`dashboardService`)
```typescript
dashboardService.getStats() -> Promise<DashboardStats>
dashboardService.getWidgets() -> Promise<Widget[]>
dashboardService.getAlerts() -> Promise<Alert[]>
dashboardService.getDashboard() -> Promise<Dashboard>
```

**Backend Endpoints:**
- `GET /dashboard/stats`
- `GET /dashboard/widgets`
- `GET /dashboard/alerts`
- `GET /dashboard` (combined endpoint)

### Inventory (`inventoryService`)
```typescript
inventoryService.getInventory(page, limit) -> Promise<PaginatedResponse<InventoryItem>>
inventoryService.getItem(id) -> Promise<InventoryItem>
inventoryService.createItem(data) -> Promise<InventoryItem>
inventoryService.updateItem(id, data) -> Promise<InventoryItem>
inventoryService.deleteItem(id) -> Promise<void>
```

**Backend Endpoints:**
- `GET /inventory?page=1&limit=20`
- `GET /inventory/:id`
- `POST /inventory`
- `PUT /inventory/:id`
- `DELETE /inventory/:id`

### Orders (`orderService`)
```typescript
orderService.getOrders(page, limit) -> Promise<PaginatedResponse<Order>>
orderService.getOrder(id) -> Promise<Order>
orderService.createOrder(data) -> Promise<Order>
orderService.updateOrder(id, data) -> Promise<Order>
orderService.deleteOrder(id) -> Promise<void>
```

**Backend Endpoints:**
- `GET /orders?page=1&limit=20`
- `GET /orders/:id`
- `POST /orders`
- `PUT /orders/:id`
- `DELETE /orders/:id`

### Customers (`customerService`)
```typescript
customerService.getCustomers(page, limit) -> Promise<PaginatedResponse<Customer>>
customerService.getCustomer(id) -> Promise<Customer>
customerService.createCustomer(data) -> Promise<Customer>
customerService.updateCustomer(id, data) -> Promise<Customer>
customerService.deleteCustomer(id) -> Promise<void>
```

**Backend Endpoints:**
- `GET /customers?page=1&limit=20`
- `GET /customers/:id`
- `POST /customers`
- `PUT /customers/:id`
- `DELETE /customers/:id`

### Employees (`employeeService`)
```typescript
employeeService.getEmployees(page, limit) -> Promise<PaginatedResponse<Employee>>
employeeService.getEmployee(id) -> Promise<Employee>
employeeService.createEmployee(data) -> Promise<Employee>
employeeService.updateEmployee(id, data) -> Promise<Employee>
employeeService.deleteEmployee(id) -> Promise<void>
```

**Backend Endpoints:**
- `GET /employees?page=1&limit=20`
- `GET /employees/:id`
- `POST /employees`
- `PUT /employees/:id`
- `DELETE /employees/:id`

### Suppliers (`supplierService`)
```typescript
supplierService.getSuppliers(page, limit) -> Promise<PaginatedResponse<Supplier>>
supplierService.getSupplier(id) -> Promise<Supplier>
supplierService.createSupplier(data) -> Promise<Supplier>
supplierService.updateSupplier(id, data) -> Promise<Supplier>
supplierService.deleteSupplier(id) -> Promise<void>
```

**Backend Endpoints:**
- `GET /suppliers?page=1&limit=20`
- `GET /suppliers/:id`
- `POST /suppliers`
- `PUT /suppliers/:id`
- `DELETE /suppliers/:id`

### Transactions (`transactionService`)
```typescript
transactionService.getTransactions(page, limit) -> Promise<PaginatedResponse<Transaction>>
transactionService.getTransaction(id) -> Promise<Transaction>
transactionService.createTransaction(data) -> Promise<Transaction>
transactionService.updateTransaction(id, data) -> Promise<Transaction>
transactionService.deleteTransaction(id) -> Promise<void>
```

**Backend Endpoints:**
- `GET /transactions?page=1&limit=20`
- `GET /transactions/:id`
- `POST /transactions`
- `PUT /transactions/:id`
- `DELETE /transactions/:id`

### Alerts (`alertService`)
```typescript
alertService.getAlerts(page, limit) -> Promise<PaginatedResponse<Alert>>
alertService.markAsRead(id) -> Promise<Alert>
alertService.deleteAlert(id) -> Promise<void>
```

**Backend Endpoints:**
- `GET /alerts?page=1&limit=50`
- `POST /alerts/:id/read`
- `DELETE /alerts/:id`

### AI Insights (`aiInsightsService`)
```typescript
aiInsightsService.getInsights() -> Promise<Insight[]>
aiInsightsService.getPrediction(input) -> Promise<Prediction>
```

**Backend Endpoints:**
- `GET /ai/insights`
- `POST /ai/predict`

### Settings (`settingsService`)
```typescript
// Company Settings
settingsService.getCompanyInfo() -> Promise<CompanyInfo>
settingsService.updateCompanyInfo(data) -> Promise<CompanyInfo>

// User Preferences
settingsService.getPreferences() -> Promise<UserSettings>
settingsService.updatePreferences(data) -> Promise<UserSettings>

// Devices
settingsService.getDevices() -> Promise<Device[]>
settingsService.addDevice(data) -> Promise<Device>
settingsService.removeDevice(id) -> Promise<void>

// Backups
settingsService.getBackups() -> Promise<Backup[]>
settingsService.createBackup() -> Promise<Backup>
settingsService.downloadBackup(id) -> Promise<Blob>
settingsService.deleteBackup(id) -> Promise<void>

// Users
settingsService.getUsers() -> Promise<User[]>
settingsService.addUser(data) -> Promise<User>
settingsService.updateUser(id, data) -> Promise<User>
settingsService.deleteUser(id) -> Promise<void>
```

**Backend Endpoints:**
- `GET/PUT /settings/company`
- `GET/PUT /settings/preferences`
- `GET/POST /settings/devices`
- `DELETE /settings/devices/:id`
- `GET/POST /settings/backups`
- `GET /settings/backups/:id/download`
- `DELETE /settings/backups/:id`
- `GET/POST /settings/users`
- `PUT /settings/users/:id`
- `DELETE /settings/users/:id`

## Error Handling

All API calls throw `ApiError` with detailed information:

```typescript
import { ApiError } from '../services'

try {
  const order = await orderService.getOrder('123')
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`Status: ${error.status}`)
    console.error(`Message: ${error.message}`)
    console.error(`Data: ${error.data}`)
  }
}
```

## Request/Response Format

### Request Format
All requests include:
- `Content-Type: application/json`
- `Authorization: Bearer <token>` (if authenticated)
- Request body as JSON

### Response Format
Expected response structure:
```typescript
{
  "success": boolean,
  "data": T, // your data
  "message": string // optional
}
```

For paginated endpoints:
```typescript
{
  "data": T[],
  "total": number,
  "page": number,
  "limit": number
}
```

## File Upload Example

For file uploads, use `apiFetchFormData`:

```typescript
import { apiFetchFormData } from '../services'

const formData = new FormData()
formData.append('file', file)
formData.append('name', 'filename')

const response = await apiFetchFormData<YourType>(
  '/upload-endpoint',
  formData
)
```

## Authentication Flow

1. User logs in via `authService.login()`
2. Backend returns `token` and `user`
3. Token stored in `localStorage`
4. All subsequent requests automatically include token in header
5. On logout, token is cleared

## Development Tips

### Enable API Logging
During development, API requests are logged to console in dev mode:
```
[API] POST /orders
[API] Response: 201 /orders
```

### Mock Implementation During Development
If backend not ready, implement mock data in services:

```typescript
// In orderService.ts
export const orderService = {
  getOrders: async (page = 1, limit = 20) => {
    // Mock implementation
    return {
      data: mockOrders,
      total: mockOrders.length,
      page,
      limit,
    }
  },
  // ... rest of methods
}
```

### Environment Variables

```env
# Development
VITE_API_URL=http://localhost:5000/api

# Production
VITE_API_URL=https://api.supplysense.com/api
```

## Backend Requirements Summary

Your backend needs to implement these endpoints:

```
Authentication:
  POST   /api/auth/login
  POST   /api/auth/register
  POST   /api/auth/logout
  POST   /api/auth/validate-license
  GET    /api/auth/profile
  PUT    /api/auth/profile

Dashboard:
  GET    /api/dashboard/stats
  GET    /api/dashboard/widgets
  GET    /api/dashboard/alerts

CRUD Operations (with pagination support):
  GET    /api/{resource}?page=1&limit=20
  GET    /api/{resource}/:id
  POST   /api/{resource}
  PUT    /api/{resource}/:id
  DELETE /api/{resource}/:id

Resources: inventory, orders, customers, employees, suppliers, transactions

Special Endpoints:
  GET    /api/alerts?page=1&limit=50
  POST   /api/alerts/:id/read
  GET    /api/ai/insights
  POST   /api/ai/predict
  (settings endpoints as listed above)
```

## Common Integration Patterns

### In React Components
```typescript
import { useEffect, useState } from 'react'
import { orderService, Order, ApiError } from '../services'

export function OrderList() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderService.getOrders(1, 20)
        setOrders(response.data)
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  // ... component JSX
}
```

### With Zustand Store
```typescript
import { create } from 'zustand'
import { orderService, Order, ApiError } from '../services'

interface OrderStore {
  orders: Order[]
  loading: boolean
  error: string | null
  fetchOrders: () => Promise<void>
}

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [],
  loading: false,
  error: null,

  fetchOrders: async () => {
    set({ loading: true, error: null })
    try {
      const response = await orderService.getOrders(1, 20)
      set({ orders: response.data })
    } catch (err) {
      if (err instanceof ApiError) {
        set({ error: err.message })
      }
    } finally {
      set({ loading: false })
    }
  },
}))
```

## Troubleshooting

### CORS Issues
Ensure backend includes proper CORS headers:
```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
```

### 401 Unauthorized
Token has expired or is invalid. User needs to re-authenticate.

### 403 Forbidden
User lacks permissions for the requested resource.

### 404 Not Found
The endpoint doesn't exist on the backend. Check backend implementation.

### Network Errors
Check that backend is running and API_URL is correct.

## Next Steps

1. Implement corresponding backend endpoints
2. Return data in expected format
3. Test endpoints with Postman or similar tool
4. Update frontend `.env` to point to your backend
5. Test full authentication flow
6. Enable features one by one as backend endpoints become ready
