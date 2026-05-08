# Backend API Implementation Checklist

This checklist outlines all the API endpoints that need to be implemented for the SupplySense frontend to work correctly.

## General Requirements

- [ ] All endpoints should accept and return JSON
- [ ] Include CORS headers allowing frontend domain
- [ ] Include rate limiting/throttling protection
- [ ] Use JWT tokens for authentication
- [ ] Return appropriate HTTP status codes
- [ ] Handle errors with meaningful error messages
- [ ] Include request validation
- [ ] Log all requests/errors for debugging

## Authentication Endpoints (`/api/auth`)

- [ ] `POST /auth/login`
  - Input: `{ email: string, password: string }`
  - Output: `{ token: string, user: User }`
  - Status: 200 (success), 401 (invalid credentials)

- [ ] `POST /auth/register`
  - Input: `{ email: string, password: string, name: string }`
  - Output: `{ token: string, user: User }`
  - Status: 201 (created), 409 (email exists)
  - Action: Create user account, hash password, return token

- [ ] `POST /auth/logout`
  - Requires: Authorization header with token
  - Output: `{ success: boolean }`
  - Status: 200 (success)
  - Action: Invalidate session/token

- [ ] `POST /auth/validate-license`
  - Input: `{ licenseKey: string }`
  - Output: `{ valid: boolean, expiresAt?: string }`
  - Status: 200 (success)
  - Action: Validate license key against database

- [ ] `GET /auth/profile`
  - Requires: Authorization header with token
  - Output: `User`
  - Status: 200 (success), 401 (unauthorized)
  - Action: Return current user profile

- [ ] `PUT /auth/profile`
  - Requires: Authorization header with token
  - Input: `{ name?: string, email?: string, ... }`
  - Output: `User`
  - Status: 200 (success), 400 (validation error)
  - Action: Update user profile

## Dashboard Endpoints (`/api/dashboard`)

- [ ] `GET /dashboard/stats`
  - Output: 
    ```typescript
    {
      totalRevenue: number,
      totalOrders: number,
      totalCustomers: number,
      totalInventory: number
    }
    ```
  - Status: 200 (success)

- [ ] `GET /dashboard/widgets`
  - Output: 
    ```typescript
    Array<{
      id: string,
      title: string,
      type: 'chart' | 'stat' | 'list',
      data: any
    }>
    ```
  - Status: 200 (success)

- [ ] `GET /dashboard/alerts`
  - Output:
    ```typescript
    Array<{
      id: string,
      type: 'warning' | 'error' | 'info' | 'success',
      title: string,
      message: string,
      timestamp: string,
      read: boolean
    }>
    ```
  - Status: 200 (success)

## Inventory Endpoints (`/api/inventory`)

- [ ] `GET /inventory?page=1&limit=20`
  - Output:
    ```typescript
    {
      data: InventoryItem[],
      total: number,
      page: number,
      limit: number
    }
    ```
  - Status: 200 (success)

- [ ] `GET /inventory/:id`
  - Output: `InventoryItem`
  - Status: 200 (success), 404 (not found)

- [ ] `POST /inventory`
  - Input: `Partial<InventoryItem>`
  - Output: `InventoryItem`
  - Status: 201 (created), 400 (validation error)

- [ ] `PUT /inventory/:id`
  - Input: `Partial<InventoryItem>`
  - Output: `InventoryItem`
  - Status: 200 (success), 404 (not found)

- [ ] `DELETE /inventory/:id`
  - Status: 204 (no content), 404 (not found)

## Order Endpoints (`/api/orders`)

- [ ] `GET /orders?page=1&limit=20`
  - Output:
    ```typescript
    {
      data: Order[],
      total: number,
      page: number,
      limit: number
    }
    ```

- [ ] `GET /orders/:id`
  - Output: `Order`

- [ ] `POST /orders`
  - Input: `Partial<Order>`
  - Output: `Order`

- [ ] `PUT /orders/:id`
  - Input: `Partial<Order>`
  - Output: `Order`

- [ ] `DELETE /orders/:id`
  - Status: 204 (no content)

## Customer Endpoints (`/api/customers`)

- [ ] `GET /customers?page=1&limit=20`
- [ ] `GET /customers/:id`
- [ ] `POST /customers`
- [ ] `PUT /customers/:id`
- [ ] `DELETE /customers/:id`

## Employee Endpoints (`/api/employees`)

- [ ] `GET /employees?page=1&limit=20`
- [ ] `GET /employees/:id`
- [ ] `POST /employees`
- [ ] `PUT /employees/:id`
- [ ] `DELETE /employees/:id`

## Supplier Endpoints (`/api/suppliers`)

- [ ] `GET /suppliers?page=1&limit=20`
- [ ] `GET /suppliers/:id`
- [ ] `POST /suppliers`
- [ ] `PUT /suppliers/:id`
- [ ] `DELETE /suppliers/:id`

## Transaction Endpoints (`/api/transactions`)

- [ ] `GET /transactions?page=1&limit=20`
- [ ] `GET /transactions/:id`
- [ ] `POST /transactions`
- [ ] `PUT /transactions/:id`
- [ ] `DELETE /transactions/:id`

## Alert Endpoints (`/api/alerts`)

- [ ] `GET /alerts?page=1&limit=50`
  - Output:
    ```typescript
    {
      data: Alert[],
      total: number,
      page: number,
      limit: number
    }
    ```

- [ ] `POST /alerts/:id/read`
  - Output: `Alert`
  - Action: Mark alert as read

- [ ] `DELETE /alerts/:id`
  - Status: 204 (no content)

## AI Insights Endpoints (`/api/ai`)

- [ ] `GET /ai/insights`
  - Output:
    ```typescript
    Array<{
      id: string,
      title: string,
      description: string,
      score: number,
      recommendation: string,
      timestamp: string
    }>
    ```

- [ ] `POST /ai/predict`
  - Input: `{ input: any }`
  - Output:
    ```typescript
    {
      prediction: number | string,
      confidence: number,
      factors: string[]
    }
    ```

## Settings Endpoints (`/api/settings`)

### Company Info
- [ ] `GET /settings/company`
  - Output: `CompanyInfo`

- [ ] `PUT /settings/company`
  - Input: `Partial<CompanyInfo>`
  - Output: `CompanyInfo`

### User Preferences
- [ ] `GET /settings/preferences`
  - Output: `UserSettings`

- [ ] `PUT /settings/preferences`
  - Input: `Partial<UserSettings>`
  - Output: `UserSettings`

### Devices
- [ ] `GET /settings/devices`
  - Output: `Device[]`

- [ ] `POST /settings/devices`
  - Input: `Partial<Device>`
  - Output: `Device`

- [ ] `DELETE /settings/devices/:id`
  - Status: 204 (no content)

### Backups
- [ ] `GET /settings/backups`
  - Output: `Backup[]`

- [ ] `POST /settings/backups`
  - Output: `Backup`
  - Action: Create new backup

- [ ] `GET /settings/backups/:id/download`
  - Output: File blob
  - Content-Type: application/octet-stream

- [ ] `DELETE /settings/backups/:id`
  - Status: 204 (no content)

### Users Management
- [ ] `GET /settings/users`
  - Output: `User[]`
  - Requires: Admin role

- [ ] `POST /settings/users`
  - Input: `Partial<User>`
  - Output: `User`
  - Requires: Admin role

- [ ] `PUT /settings/users/:id`
  - Input: `Partial<User>`
  - Output: `User`
  - Requires: Admin role

- [ ] `DELETE /settings/users/:id`
  - Status: 204 (no content)
  - Requires: Admin role

## Data Type Specifications

### User Type
```typescript
{
  id: string
  email: string
  name: string
  role: 'admin' | 'manager' | 'user'
}
```

### InventoryItem Type
```typescript
{
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
```

### Order Type
```typescript
{
  id: string
  orderNumber: string
  customer: string
  amount: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered'
  riskPrediction: 'low' | 'medium' | 'high'
  date: string
}
```

### Customer Type
```typescript
{
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
```

### Other Types
See `client/src/services/types.ts` for complete type definitions.

## HTTP Status Codes to Use

- `200 OK` - Successful GET/PUT
- `201 Created` - Successful POST
- `204 No Content` - Successful DELETE
- `400 Bad Request` - Invalid input/validation error
- `401 Unauthorized` - Missing/invalid authentication
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource doesn't exist
- `409 Conflict` - Resource already exists (e.g., duplicate email)
- `500 Internal Server Error` - Server error

## CORS Configuration

The backend should include these CORS headers:

```
Access-Control-Allow-Origin: http://localhost:5173 (dev) or your production domain
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400
```

## Authentication

All endpoints except `/auth/login`, `/auth/register`, and `/auth/validate-license` require:

```
Authorization: Bearer <jwt_token>
```

Decode and validate the JWT token to get the user ID for permission checks.

## Request Format Example

```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGc..." \
  -d '{
    "orderNumber": "ORD-001",
    "customer": "ACME Corp",
    "amount": 2500,
    "status": "pending",
    "riskPrediction": "low",
    "date": "2024-01-15"
  }'
```

## Response Format Example

```json
{
  "id": "123",
  "orderNumber": "ORD-001",
  "customer": "ACME Corp",
  "amount": 2500,
  "status": "pending",
  "riskPrediction": "low",
  "date": "2024-01-15"
}
```

## Testing Endpoints

### Using Postman
1. Set base URL: `http://localhost:5000/api`
2. First call `/auth/login` to get token
3. Add token to Authorization header (Bearer type)
4. Test other endpoints

### Using curl
```bash
# Login
TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}' \
  | jq -r '.token')

# Use token in request
curl -X GET http://localhost:5000/api/inventory \
  -H "Authorization: Bearer $TOKEN"
```

## Implementation Priority

**Phase 1 (Critical)**
- [ ] Auth endpoints (login, register, profile)
- [ ] Inventory endpoints
- [ ] Order endpoints

**Phase 2 (Important)**
- [ ] Customer endpoints
- [ ] Dashboard endpoints
- [ ] Alert endpoints

**Phase 3 (Enhancement)**
- [ ] Employee endpoints
- [ ] Supplier endpoints
- [ ] Transaction endpoints
- [ ] AI endpoints
- [ ] Settings endpoints

## Notes

- All date/time should be ISO 8601 format (e.g., "2024-01-15T10:30:00Z")
- IDs should be unique strings (UUID recommended)
- Implement pagination offset/limit pattern as shown
- Always validate input before processing
- Log errors with full context for debugging
- Consider adding request ID tracking for troubleshooting
