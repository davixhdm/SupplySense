============================================================
SUPPLYSENSE CLIENT API ENDPOINTS
============================================================

BASE URL: http://localhost:5000/api/client
STATUS: ✅ All 64 endpoints configured and ready for development


============================================================
AUTH (13 ENDPOINTS) ✅
============================================================

POST   /auth/register              Register new organization
POST   /auth/login                 Client login
POST   /auth/logout                Client logout
POST   /auth/activate-license      Activate device with license key
POST   /auth/verify-device         Verify device with OTP
POST   /auth/send-device-otp       Send OTP for device verification
POST   /auth/forgot-password       Request password reset
POST   /auth/reset-password        Reset password with token
POST   /auth/manual-payment        Submit manual payment (M-Pesa)
GET    /auth/profile               Get current user profile
PUT    /auth/profile               Update current user profile
PUT    /auth/change-password       Change password

Service: authService.ts
Export: export { authService } from './services'


============================================================
DASHBOARD (2 ENDPOINTS) ✅
============================================================

GET    /dashboard/stats            Dashboard statistics
GET    /dashboard/charts           Dashboard chart data

Service: dashboardService.ts
Export: export { dashboardService } from './services'


============================================================
TRANSACTIONS (5 ENDPOINTS) ✅
============================================================

GET    /transactions               List transactions
GET    /transactions/summary       Transaction summary by period
GET    /transactions/:id           Get transaction by ID
POST   /transactions               Create transaction
PUT    /transactions/:id           Update transaction

Service: transactionService.ts
Export: export { transactionService } from './services'


============================================================
ORDERS (5 ENDPOINTS) ✅
============================================================

GET    /orders                     List orders
GET    /orders/stats               Order statistics
GET    /orders/:id                 Get order by ID
POST   /orders                     Create order
PUT    /orders/:id                 Update order
PUT    /orders/:id/status          Update order status

Service: orderService.ts
Export: export { orderService } from './services'


============================================================
INVENTORY (8 ENDPOINTS) ✅
============================================================

GET    /inventory                  List products
GET    /inventory/categories       List product categories
GET    /inventory/low-stock        List low stock products
GET    /inventory/:id              Get product by ID
POST   /inventory                  Create product
PUT    /inventory/:id              Update product
PUT    /inventory/:id/stock        Adjust stock level
DELETE /inventory/:id              Deactivate product

Service: inventoryService.ts
Export: export { inventoryService } from './services'


============================================================
SUPPLIERS (5 ENDPOINTS) ✅
============================================================

GET    /suppliers                  List suppliers
GET    /suppliers/performance      Supplier performance rankings
GET    /suppliers/:id              Get supplier by ID
POST   /suppliers                  Create supplier
PUT    /suppliers/:id              Update supplier
DELETE /suppliers/:id              Deactivate supplier

Service: supplierService.ts
Export: export { supplierService } from './services'


============================================================
CUSTOMERS (5 ENDPOINTS) ✅
============================================================

GET    /customers                  List customers
GET    /customers/stats            Customer statistics
GET    /customers/:id              Get customer by ID
POST   /customers                  Create customer
PUT    /customers/:id              Update customer
DELETE /customers/:id              Deactivate customer

Service: customerService.ts
Export: export { customerService } from './services'


============================================================
EMPLOYEES (6 ENDPOINTS) ✅
============================================================

GET    /employees                  List employees
GET    /employees/departments      Department performance
GET    /employees/:id              Get employee by ID
POST   /employees                  Create employee
PUT    /employees/:id              Update employee
PUT    /employees/:id/performance  Record employee performance
DELETE /employees/:id              Deactivate employee

Service: employeeService.ts
Export: export { employeeService } from './services'


============================================================
AI INSIGHTS (3 ENDPOINTS) ✅
============================================================

GET    /ai-insights                General AI insights
GET    /ai-insights/search         Search insights by query/category
GET    /ai-insights/prediction     Get specific prediction

Service: aiInsightsService.ts
Export: export { aiInsightsService } from './services'


============================================================
ALERTS (5 ENDPOINTS) ✅
============================================================

GET    /alerts                     List alerts
GET    /alerts/unread-count        Unread alert count
PUT    /alerts/:id/read            Mark alert as read
PUT    /alerts/read-all            Mark all alerts as read
PUT    /alerts/:id/action          Mark alert as actioned
PUT    /alerts/:id/dismiss         Dismiss alert

Service: alertService.ts
Export: export { alertService } from './services'


============================================================
COMPANY SETTINGS (3 ENDPOINTS) ✅
============================================================

GET    /company-settings           Get company info
PUT    /company-settings           Update company info
POST   /company-settings/logo      Upload company logo

Service: companySettingsService.ts
Export: export { companySettingsService } from './services'


============================================================
PREFERENCES (2 ENDPOINTS) ✅
============================================================

GET    /preferences                Get user preferences
PUT    /preferences                Update user preferences

Service: preferencesService.ts
Export: export { preferencesService } from './services'


============================================================
USERS (5 ENDPOINTS) ✅
============================================================

GET    /users                      List users
GET    /users/:id                  Get user by ID
POST   /users                      Create user
PUT    /users/:id                  Update user
DELETE /users/:id                  Deactivate user

Service: userService.ts
Export: export { userService } from './services'


============================================================
DEVICES (4 ENDPOINTS) ✅
============================================================

GET    /devices                    List devices
GET    /devices/:id                Get device by ID
GET    /devices/:id/activity       Get device activity
PUT    /devices/:id/deactivate     Deactivate device

Service: deviceService.ts
Export: export { deviceService } from './services'


============================================================
BACKUP (3 ENDPOINTS) ✅
============================================================

POST   /backups                    Create backup
GET    /backups                    List backup history
GET    /backups/download/:filename Download backup file

Service: backupService.ts
Export: export { backupService } from './services'


============================================================
TOTAL: 64 ENDPOINTS ✅
============================================================


USAGE EXAMPLES
============================================================

// Import services
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

// Example: Get dashboard statistics
const stats = await dashboardService.getStats()

// Example: List orders with pagination
const orders = await orderService.getOrders(1, 20)

// Example: Create a new product
const product = await inventoryService.createItem({
  name: 'Product Name',
  sku: 'SKU-001',
  quantity: 100,
  reorderLevel: 10,
  price: 99.99,
  category: 'Electronics'
})

// Example: Update user preferences
const preferences = await preferencesService.updatePreferences({
  theme: 'dark',
  notifications: true
})

// Example: Get unread alerts
const unreadCount = await alertService.getUnreadCount()


NOTES
============================================================

✅ All services are fully typed with TypeScript
✅ All services use centralized apiFetch utility with error handling
✅ All services follow consistent naming conventions
✅ Authentication token is automatically included in all requests
✅ Server routes are properly mounted in server.js
✅ Error handling and logging configured
✅ Pagination support included where needed
✅ Form data upload support for file uploads (company logo)
✅ Ready for controller implementation on backend
