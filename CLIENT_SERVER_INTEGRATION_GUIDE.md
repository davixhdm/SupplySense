# CLIENT-SERVER INTEGRATION GUIDE

**Purpose:** Complete guide for connecting SupplySense frontend with backend API

---

## 🔌 Quick Start

### 1. Import Services and Hooks

```typescript
import { 
  authService,
  dashboardService,
  inventoryService,
  orderService,
  customerService,
  supplierService,
  transactionService,
  employeeService,
  alertService,
  aiInsightsService,
  companySettingsService,
  preferencesService,
  userService,
  deviceService,
  backupService
} from '@/services'

import { 
  useApi, 
  useApiPaginated, 
  useApiMutation,
  useHandleApiError 
} from '@/hooks'
```

### 2. Fetch Data with Hooks

```typescript
// Simple data fetching
const { data, loading, error, refetch } = useApi(
  () => dashboardService.getStats(),
  []
)

// Paginated data
const { data: orders, page, nextPage, prevPage } = useApiPaginated(
  orderService.getOrders,
  1,
  20
)

// Mutations (POST, PUT, DELETE)
const { mutate: createOrder, loading: creating } = useApiMutation(
  (data) => orderService.createOrder(data)
)
```

---

## 📋 Service Integration by Module

### AUTH MODULE
**File:** `authService.ts`
**Backend:** `/api/client/auth`

```typescript
// Login
const response = await authService.login(email, password)
localStorage.setItem('token', response.token)

// Register
const response = await authService.register(orgData)

// Change Password
await authService.changePassword(oldPassword, newPassword)

// Get Profile
const profile = await authService.getProfile()

// Update Profile
await authService.updateProfile({ name: 'New Name' })
```

### DASHBOARD MODULE
**File:** `dashboardService.ts`
**Backend:** `/api/client/dashboard`

```typescript
// Get Statistics
const stats = await dashboardService.getStats()
// Returns: { totalRevenue, totalOrders, totalCustomers, ... }

// Get Chart Data
const charts = await dashboardService.getCharts()
```

**Integration in Component:**
```typescript
function DashboardPage() {
  const { data: stats, loading, error } = useApi(
    () => dashboardService.getStats(),
    []
  )

  if (loading) return <Spinner />
  if (error) return <ErrorMessage message={error} />

  return (
    <div>
      <StatsCard title="Revenue" value={`$${stats.totalRevenue}`} />
    </div>
  )
}
```

### INVENTORY MODULE
**File:** `inventoryService.ts`
**Backend:** `/api/client/inventory`

```typescript
// List with Pagination
const { data, page, nextPage } = useApiPaginated(
  inventoryService.getInventory,
  1,
  20
)

// Get Categories
const categories = await inventoryService.getCategories()

// Get Low Stock Items
const lowStock = await inventoryService.getLowStockProducts()

// Create Product
const { mutate: createProduct } = useApiMutation(
  (data) => inventoryService.createItem(data)
)
await createProduct({ name: 'Widget', sku: 'SKU-001', quantity: 100 })

// Adjust Stock
await inventoryService.adjustStock(productId, 50)

// Delete Product
await inventoryService.deleteItem(productId)
```

### ORDERS MODULE
**File:** `orderService.ts`
**Backend:** `/api/client/orders`

```typescript
// List Orders
const { data: orders } = useApiPaginated(
  orderService.getOrders,
  1,
  20
)

// Order Statistics
const stats = await orderService.getOrderStats()

// Create Order
const { mutate: createOrder } = useApiMutation(
  (data) => orderService.createOrder(data)
)

// Update Order Status
await orderService.updateOrderStatus(orderId, 'shipped')
```

### CUSTOMERS MODULE
**File:** `customerService.ts`
**Backend:** `/api/client/customers`

```typescript
// List Customers
const { data: customers } = useApiPaginated(
  customerService.getCustomers,
  1,
  20
)

// Customer Statistics
const stats = await customerService.getCustomerStats()

// Create Customer
const { mutate: createCustomer } = useApiMutation(
  (data) => customerService.createCustomer(data)
)

// Update Customer
await customerService.updateCustomer(customerId, updateData)

// Delete/Deactivate Customer
await customerService.deleteCustomer(customerId)
```

### SUPPLIERS MODULE
**File:** `supplierService.ts`
**Backend:** `/api/client/suppliers`

```typescript
// List Suppliers
const { data: suppliers } = useApiPaginated(
  supplierService.getSuppliers,
  1,
  20
)

// Supplier Performance
const performance = await supplierService.getSupplierPerformance()

// CRUD Operations
await supplierService.createSupplier(data)
await supplierService.updateSupplier(id, data)
await supplierService.deleteSupplier(id)
```

### EMPLOYEES MODULE
**File:** `employeeService.ts`
**Backend:** `/api/client/employees`

```typescript
// List Employees
const { data: employees } = useApiPaginated(
  employeeService.getEmployees,
  1,
  20
)

// Department Performance
const performance = await employeeService.getDepartmentPerformance()

// Record Performance
await employeeService.recordPerformance(employeeId, performanceData)

// CRUD Operations
await employeeService.createEmployee(data)
await employeeService.updateEmployee(id, data)
await employeeService.deleteEmployee(id)
```

### TRANSACTIONS MODULE
**File:** `transactionService.ts`
**Backend:** `/api/client/transactions`

```typescript
// List Transactions
const { data: transactions } = useApiPaginated(
  transactionService.getTransactions,
  1,
  20
)

// Transaction Summary
const summary = await transactionService.getTransactionSummary('monthly')

// CRUD Operations
await transactionService.createTransaction(data)
await transactionService.updateTransaction(id, data)
```

### ALERTS MODULE
**File:** `alertService.ts`
**Backend:** `/api/client/alerts`

```typescript
// List Alerts
const { data: alerts } = useApiPaginated(
  alertService.getAlerts,
  1,
  50
)

// Get Unread Count
const { count } = await alertService.getUnreadCount()

// Mark as Read
await alertService.markAsRead(alertId)

// Mark All as Read
await alertService.markAllAsRead()

// Action Alert
await alertService.markAsActioned(alertId)

// Dismiss Alert
await alertService.dismissAlert(alertId)
```

### AI INSIGHTS MODULE
**File:** `aiInsightsService.ts`
**Backend:** `/api/client/ai-insights`

```typescript
// Get Insights
const insights = await aiInsightsService.getInsights()

// Search Insights
const results = await aiInsightsService.searchInsights('inventory', 'stock')

// Get Prediction
const prediction = await aiInsightsService.getPrediction(inputData)
```

### COMPANY SETTINGS MODULE
**File:** `companySettingsService.ts`
**Backend:** `/api/client/company-settings`

```typescript
// Get Settings
const settings = await companySettingsService.getCompanySettings()

// Update Settings
await companySettingsService.updateCompanySettings(settingsData)

// Upload Logo
const logoFile = document.getElementById('logo-input').files[0]
await companySettingsService.uploadCompanyLogo(logoFile)
```

### PREFERENCES MODULE
**File:** `preferencesService.ts`
**Backend:** `/api/client/preferences`

```typescript
// Get Preferences
const prefs = await preferencesService.getPreferences()

// Update Preferences
await preferencesService.updatePreferences({
  theme: 'dark',
  notifications: true,
  language: 'en'
})
```

### USERS MODULE
**File:** `userService.ts`
**Backend:** `/api/client/users`

```typescript
// List Users
const { data: users } = useApiPaginated(userService.getUsers, 1, 20)

// CRUD Operations
await userService.createUser(userData)
await userService.updateUser(userId, userData)
await userService.deleteUser(userId)
```

### DEVICES MODULE
**File:** `deviceService.ts`
**Backend:** `/api/client/devices`

```typescript
// List Devices
const { data: devices } = useApiPaginated(deviceService.getDevices, 1, 20)

// Get Device Activity
const activity = await deviceService.getDeviceActivity(deviceId)

// Deactivate Device
await deviceService.deactivateDevice(deviceId)
```

### BACKUPS MODULE
**File:** `backupService.ts`
**Backend:** `/api/client/backups`

```typescript
// Create Backup
const backup = await backupService.createBackup()

// List Backups
const { data: backups } = useApiPaginated(
  backupService.getBackups,
  1,
  20
)

// Download Backup
const blob = await backupService.downloadBackup(filename)
```

---

## 🏗️ Complete Page Example

### Before (Mock Data):
```typescript
export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([
    { id: '1', orderNumber: 'ORD-001', ... }
  ])
  const [loading, setLoading] = useState(false)

  return (
    <DashboardLayout>
      <Table data={orders} />
    </DashboardLayout>
  )
}
```

### After (With API Integration):
```typescript
import { orderService } from '@/services'
import { useApiPaginated, useHandleApiError } from '@/hooks'

export default function OrdersPage() {
  const {
    data: orders,
    loading,
    error,
    page,
    limit,
    nextPage,
    prevPage,
    setPageSize,
    refetch
  } = useApiPaginated(orderService.getOrders, 1, 20)

  const { handleError } = useHandleApiError({
    onError: (msg) => console.error(msg)
  })

  if (loading) return <Spinner />
  if (error) return <ErrorMessage message={error} onRetry={refetch} />

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <Table data={orders} />
        <Pagination
          page={page}
          onNext={nextPage}
          onPrev={prevPage}
        />
      </div>
    </DashboardLayout>
  )
}
```

---

## 🔐 Authentication Flow

### Login Flow:
```typescript
import { useAuthStore } from '@/store/authStore'
import { authService } from '@/services'

function LoginPage() {
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password)
      
      // Store token and user
      setAuth(response.user, response.token)
      localStorage.setItem('token', response.token)
      
      // Navigate to dashboard
      navigate('/dashboard')
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  return <LoginForm onSubmit={handleSubmit} />
}
```

### Token Management:
- **Stored in:** `localStorage`
- **Key:** `token`
- **Used in:** All API requests (automatically via `apiFetch`)
- **Cleared on:** Logout

---

## ⚠️ Error Handling

### Global Error Handler:
```typescript
import { useHandleApiError } from '@/hooks'

function MyComponent() {
  const { handleError, handleSuccess } = useHandleApiError({
    onError: (msg) => toast.error(msg),
    onSuccess: (msg) => toast.success(msg)
  })

  const handleSave = async () => {
    try {
      await orderService.updateOrder(id, data)
      handleSuccess('Order updated successfully')
    } catch (error) {
      const message = handleError(error, 'Failed to update order')
    }
  }

  return <button onClick={handleSave}>Save</button>
}
```

---

## 📊 Data Flow Diagram

```
┌─────────────────┐
│  React Component│
└────────┬────────┘
         │
         ├─ useApi/useApiMutation/useApiPaginated (hooks)
         │
         ├──→ Service Function (inventoryService.getItems())
         │
         ├──→ apiFetch() - HTTP Layer
         │
         ├──→ Backend API (/api/client/inventory)
         │
         ├──→ Controller (inventoryController.js)
         │
         ├──→ Database Model (ProductModel.js)
         │
         ├──→ Database (MongoDB)
         │
         └─ Return Data → Component State
```

---

## ✅ Checklist for Integration

- [ ] Import required services in component
- [ ] Use appropriate hook (useApi, useApiPaginated, useApiMutation)
- [ ] Handle loading state
- [ ] Handle error state
- [ ] Display data in UI
- [ ] Add refetch on user actions
- [ ] Test with actual backend
- [ ] Add error notifications
- [ ] Implement pagination where needed
- [ ] Add form validation before mutations

---

## 🚀 Testing Integration

### Test with Postman or cURL:
```bash
# Login
curl -X POST http://localhost:5000/api/client/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'

# Get Dashboard Stats
curl -X GET http://localhost:5000/api/client/dashboard/stats \
  -H "Authorization: Bearer <token>"

# Get Inventory
curl -X GET http://localhost:5000/api/client/inventory?page=1&limit=20 \
  -H "Authorization: Bearer <token>"
```

---

## 📞 Troubleshooting

### CORS Error
- **Issue:** `Access to XMLHttpRequest blocked by CORS`
- **Solution:** Check `server.js` CORS configuration matches your frontend URL

### 401 Unauthorized
- **Issue:** Token not included in request
- **Solution:** Ensure token is in localStorage under key `token`

### 404 Not Found
- **Issue:** Endpoint doesn't exist
- **Solution:** Check endpoint path matches API_ENDPOINTS_COMPLETE.md

### Timeout
- **Issue:** Request takes too long
- **Solution:** Check backend server is running and database is connected

---

## 📝 Next Steps

1. **Update all dashboard pages** to use the integration pattern
2. **Implement loading skeletons** for better UX
3. **Add error boundaries** for error handling
4. **Create reusable data tables** with API integration
5. **Implement real-time updates** (WebSockets)
6. **Add request caching** (React Query/SWR)

---

**Last Updated:** May 18, 2026
**Status:** Ready for Implementation ✅
