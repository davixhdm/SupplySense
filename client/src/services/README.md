# SupplySense Frontend API Services

This directory contains all API services, types, and utilities for connecting the frontend to the SupplySense backend.

## Quick Start

### 1. Configure Backend URL

Create a `.env` file in the client folder:
```env
VITE_API_URL=http://localhost:5000/api
```

Or use the existing `.env.example` as a template.

### 2. Import Services

```typescript
import { 
  authService, 
  orderService, 
  inventoryService,
  // ... other services
  ApiError 
} from '../services'
```

### 3. Use in Components

```typescript
const orders = await orderService.getOrders()
```

## File Structure

| File | Purpose |
|------|---------|
| `api.ts` | Core API fetch utility with error handling & token management |
| `types.ts` | TypeScript interfaces for all data models |
| `index.ts` | Barrel export for easy importing |
| `authService.ts` | Authentication (login, register, profile) |
| `dashboardService.ts` | Dashboard stats and widgets |
| `inventoryService.ts` | Inventory item CRUD |
| `orderService.ts` | Order CRUD |
| `customerService.ts` | Customer CRUD |
| `employeeService.ts` | Employee CRUD |
| `supplierService.ts` | Supplier CRUD |
| `transactionService.ts` | Transaction CRUD |
| `alertService.ts` | Alert management |
| `aiInsightsService.ts` | AI insights & predictions |
| `settingsService.ts` | Settings and preferences |
| `API_INTEGRATION_GUIDE.md` | Full API documentation |

## Services Overview

### Authentication Service
- `login(email, password)` - User login
- `register(email, password, name)` - User registration  
- `logout()` - User logout
- `validateLicense(licenseKey)` - License validation
- `getProfile()` - Get user profile
- `updateProfile(updates)` - Update user profile

### Data Services (CRUD Operations)
All following services support these methods:
- `getItems(page, limit)` - List with pagination
- `getItem(id)` - Get single item
- `createItem(data)` - Create new item
- `updateItem(id, data)` - Update item
- `deleteItem(id)` - Delete item

**Available Services:**
- `inventoryService` - Inventory items
- `orderService` - Orders
- `customerService` - Customers
- `employeeService` - Employees
- `supplierService` - Suppliers
- `transactionService` - Transactions

### Specialized Services

**Dashboard Service**
- `getStats()` - Dashboard statistics
- `getWidgets()` - Dashboard widgets
- `getAlerts()` - Dashboard alerts
- `getDashboard()` - Combined endpoint

**Alert Service**
- `getAlerts(page, limit)` - List alerts
- `markAsRead(id)` - Mark alert as read
- `deleteAlert(id)` - Delete alert

**AI Insights Service**
- `getInsights()` - Get AI insights
- `getPrediction(input)` - Get AI prediction

**Settings Service**
- Company info management
- User preferences
- Device management
- Backup management
- User management

## Error Handling

All services throw `ApiError` with structured information:

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

## Type Safety

All services are fully typed:

```typescript
import { orderService, Order, PaginatedResponse } from '../services'

// response is automatically typed as PaginatedResponse<Order>
const response = await orderService.getOrders(1, 20)

// order is typed as Order
const order = await orderService.getOrder('123')
```

## Authentication Flow

1. User logs in via `authService.login()`
2. Backend returns token & user info
3. Token is stored in `localStorage`
4. All requests automatically include token in `Authorization: Bearer <token>` header
5. Token is cleared on logout

## Development Features

### API Request Logging
In development mode, all API requests are logged:
```
[API] POST /orders
[API] Response: 201 /orders
```

### Mock Implementation
During development, you can temporarily replace service methods with mock data:

```typescript
// In any service file
export const orderService = {
  getOrders: async (page = 1, limit = 20) => {
    // Return mock data instead of making API call
    return {
      data: mockOrders,
      total: 100,
      page,
      limit,
    }
  },
}
```

## Full Documentation

See [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md) for:
- Complete API endpoint reference
- Request/response formats
- Usage patterns
- Backend requirements
- Troubleshooting

## Common Issues

### 401 Unauthorized
- Token has expired or is invalid
- User needs to re-authenticate

### 403 Forbidden  
- User lacks permissions for the resource
- Check user role in backend

### 404 Not Found
- Backend endpoint doesn't exist
- Verify backend implementation

### CORS Errors
- Backend needs proper CORS headers
- Ensure `Access-Control-Allow-Origin` includes frontend URL

## Integration Checklist

- [ ] Backend API is running
- [ ] `.env` file configured with correct API URL
- [ ] Backend endpoints implemented for needed services
- [ ] CORS properly configured
- [ ] Test authentication flow
- [ ] Test data retrieval for each service
- [ ] Implement error handling in components
- [ ] Add loading states to UI

## Next Steps

1. Ensure backend is running and endpoints are implemented
2. Test each service individually
3. Integrate into React components
4. Add error handling and loading states
5. Test full workflows end-to-end
