# 🚀 QUICK REFERENCE - CLIENT-SERVER INTEGRATION

**TL;DR** - Everything is connected! Here's how to use it.

---

## 📦 Import What You Need

```typescript
// Services
import { 
  authService,
  dashboardService,
  inventoryService,
  orderService,
  customerService,
  supplierService,
  employeeService,
  transactionService,
  alertService,
  aiInsightsService,
  companySettingsService,
  preferencesService,
  userService,
  deviceService,
  backupService
} from '@/services'

// Hooks
import { 
  useApi,
  useApiPaginated,
  useApiMutation,
  useHandleApiError
} from '@/hooks'
```

---

## 🎯 Quick Examples

### Get Dashboard Stats
```typescript
const { data: stats, loading, error } = useApi(
  () => dashboardService.getStats(),
  []
)
```

### List Orders with Pagination
```typescript
const { data: orders, page, nextPage, prevPage } = useApiPaginated(
  orderService.getOrders, 1, 20
)
```

### Create New Order
```typescript
const { mutate: createOrder, loading } = useApiMutation(
  (data) => orderService.createOrder(data)
)

await createOrder({ customerName: 'ACME', amount: 5000 })
```

### Update Inventory
```typescript
const { mutate: updateStock } = useApiMutation(
  (data) => inventoryService.adjustStock(data.id, data.quantity)
)

await updateStock({ id: '123', quantity: 100 })
```

### Delete Customer
```typescript
const { mutate: deleteCustomer } = useApiMutation(
  (id) => customerService.deleteCustomer(id)
)

await deleteCustomer('customer-id')
```

---

## 📊 Available Endpoints by Service

### Auth (13)
- `login(email, password)` - 🔓
- `register(data)` - 🔓
- `logout()` - POST
- `activateLicense(key)` - POST
- `verifyDevice(otp)` - POST
- `sendDeviceOTP()` - POST
- `forgotPassword(email)` - POST
- `resetPassword(token, pwd)` - POST
- `changePassword(old, new)` - PUT
- `submitManualPayment(data)` - POST
- `getProfile()` - GET
- `updateProfile(data)` - PUT

### Dashboard (2)
- `getStats()` - GET
- `getCharts()` - GET

### Inventory (8)
- `getInventory(page, limit)` - GET
- `getCategories()` - GET
- `getLowStockProducts()` - GET
- `getItem(id)` - GET
- `createItem(data)` - POST
- `updateItem(id, data)` - PUT
- `adjustStock(id, qty)` - PUT
- `deleteItem(id)` - DELETE

### Orders (5)
- `getOrders(page, limit)` - GET
- `getOrderStats()` - GET
- `getOrder(id)` - GET
- `createOrder(data)` - POST
- `updateOrder(id, data)` - PUT
- `updateOrderStatus(id, status)` - PUT

### Customers (5)
- `getCustomers(page, limit)` - GET
- `getCustomerStats()` - GET
- `getCustomer(id)` - GET
- `createCustomer(data)` - POST
- `updateCustomer(id, data)` - PUT
- `deleteCustomer(id)` - DELETE

### Suppliers (5)
- `getSuppliers(page, limit)` - GET
- `getSupplierPerformance()` - GET
- `getSupplier(id)` - GET
- `createSupplier(data)` - POST
- `updateSupplier(id, data)` - PUT
- `deleteSupplier(id)` - DELETE

### Employees (6)
- `getEmployees(page, limit)` - GET
- `getDepartmentPerformance()` - GET
- `getEmployee(id)` - GET
- `createEmployee(data)` - POST
- `updateEmployee(id, data)` - PUT
- `recordPerformance(id, data)` - PUT
- `deleteEmployee(id)` - DELETE

### Transactions (5)
- `getTransactions(page, limit)` - GET
- `getTransactionSummary(period)` - GET
- `getTransaction(id)` - GET
- `createTransaction(data)` - POST
- `updateTransaction(id, data)` - PUT

### Alerts (5)
- `getAlerts(page, limit)` - GET
- `getUnreadCount()` - GET
- `markAsRead(id)` - PUT
- `markAllAsRead()` - PUT
- `markAsActioned(id)` - PUT
- `dismissAlert(id)` - PUT

### AI Insights (3)
- `getInsights()` - GET
- `searchInsights(query, category)` - GET
- `getPrediction(input)` - POST

### Company Settings (3)
- `getCompanySettings()` - GET
- `updateCompanySettings(data)` - PUT
- `uploadCompanyLogo(file)` - POST

### Preferences (2)
- `getPreferences()` - GET
- `updatePreferences(data)` - PUT

### Users (5)
- `getUsers(page, limit)` - GET
- `getUser(id)` - GET
- `createUser(data)` - POST
- `updateUser(id, data)` - PUT
- `deleteUser(id)` - DELETE

### Devices (4)
- `getDevices(page, limit)` - GET
- `getDevice(id)` - GET
- `getDeviceActivity(id)` - GET
- `deactivateDevice(id)` - PUT

### Backups (3)
- `createBackup()` - POST
- `getBackups(page, limit)` - GET
- `downloadBackup(filename)` - GET

---

## 🎨 Component Pattern

```typescript
import { inventoryService } from '@/services'
import { useApiPaginated } from '@/hooks'

export default function MyPage() {
  const {
    data: items,
    loading,
    error,
    page,
    nextPage,
    prevPage,
    refetch
  } = useApiPaginated(inventoryService.getInventory, 1, 20)

  if (loading) return <Spinner />
  if (error) return <ErrorAlert message={error} onRetry={refetch} />

  return (
    <div>
      <Table data={items} />
      <Pagination
        page={page}
        onNext={nextPage}
        onPrev={prevPage}
      />
    </div>
  )
}
```

---

## 🔐 Authentication

```typescript
// Login
const response = await authService.login(email, password)
localStorage.setItem('token', response.token)
setAuth(response.user, response.token)

// Token is auto-included in all requests
// Logout clears token
localStorage.removeItem('token')
```

---

## ⚡ Tips & Tricks

1. **Memoize dependencies**
   ```typescript
   const { data } = useApi(
     useCallback(() => dashboardService.getStats(), []),
     []
   )
   ```

2. **Handle empty states**
   ```typescript
   {data && data.length > 0 ? <Table /> : <EmptyState />}
   ```

3. **Retry on error**
   ```typescript
   {error && <button onClick={refetch}>Retry</button>}
   ```

4. **Show loading skeleton**
   ```typescript
   {loading ? <TableSkeleton /> : <Table data={data} />}
   ```

---

## 🐛 Debug Tips

```typescript
// Log request/response
const response = await orderService.getOrders()
console.log('Orders:', response)

// Check token
console.log('Token:', localStorage.getItem('token'))

// Check error
const { error } = useApi(fetchData, [])
console.log('Error:', error)
```

---

## 📱 Common Patterns

### Search & Filter
```typescript
const [search, setSearch] = useState('')
const filtered = items.filter(item => 
  item.name.includes(search)
)
```

### Sort
```typescript
const sorted = [...data].sort((a, b) => 
  a.name.localeCompare(b.name)
)
```

### Batch Updates
```typescript
const update = async (ids) => {
  await Promise.all(
    ids.map(id => updateItem(id, data))
  )
}
```

---

## ✅ Checklist

Before using a service:
- [ ] Import service
- [ ] Import hook
- [ ] Call hook in component
- [ ] Handle loading state
- [ ] Handle error state
- [ ] Display data
- [ ] Add pagination if needed
- [ ] Test with real data

---

## 📞 Still Need Help?

Check these files:
- `CLIENT_SERVER_INTEGRATION_GUIDE.md` - Full guide
- `INTEGRATION_COMPLETE.md` - Complete reference
- Example pages: Dashboard, Inventory, Orders, Customers

---

**Happy Coding! 🎉**
