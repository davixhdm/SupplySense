# ✅ SETUP & VERIFICATION CHECKLIST

**Purpose:** Verify client-server integration is working correctly

---

## 🔧 Pre-Flight Checklist

### Server Setup
- [ ] MongoDB is running
- [ ] Node.js dependencies installed (`npm install`)
- [ ] Environment variables configured (`.env`)
- [ ] Backend server running on `http://localhost:5000`
- [ ] No console errors in server terminal

### Client Setup
- [ ] React dependencies installed (`npm install`)
- [ ] Environment variables configured (`.env`)
- [ ] Frontend dev server running on `http://localhost:5173`
- [ ] No console errors in browser

### Network
- [ ] Both client and server running
- [ ] CORS enabled on server
- [ ] Firewall allows localhost connections

---

## 🧪 Quick Tests

### Test 1: Backend Health Check
```bash
# Terminal
curl http://localhost:5000/health

# Expected response
{
  "status": "ok",
  "database": "connected",
  "version": "1.0.0"
}
```

### Test 2: Login Endpoint
```bash
curl -X POST http://localhost:5000/api/client/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Expected response
{
  "token": "eyJ...",
  "user": { "id": "...", "email": "..." }
}
```

### Test 3: Protected Endpoint
```bash
# Use token from Test 2
curl -X GET http://localhost:5000/api/client/dashboard/stats \
  -H "Authorization: Bearer eyJ..."

# Expected response
{
  "stats": {
    "totalRevenue": 45230,
    "totalOrders": 328,
    ...
  }
}
```

### Test 4: Frontend Service Test
In browser console:
```javascript
// Test service import
import { dashboardService } from '@/services'

// Test API call
dashboardService.getStats().then(data => console.log(data))

// Should log stats from server
```

---

## 📋 Component Integration Tests

### Dashboard Page
```typescript
// Open: http://localhost:5173/dashboard
// Verify:
- [ ] Stats cards load
- [ ] No error messages
- [ ] Loading spinner appears during fetch
- [ ] Data displays after loading
- [ ] Refresh button works
```

### Inventory Page
```typescript
// Open: http://localhost:5173/dashboard/inventory
// Verify:
- [ ] Products table loads
- [ ] Pagination works
- [ ] Next/Previous buttons clickable
- [ ] Stock status colors correct
- [ ] No API errors in console
```

### Orders Page
```typescript
// Open: http://localhost:5173/dashboard/orders
// Verify:
- [ ] Orders table loads
- [ ] Status badges display
- [ ] Risk prediction colors work
- [ ] Search/filter functional
- [ ] Pagination works
```

### Customers Page
```typescript
// Open: http://localhost:5173/dashboard/customers
// Verify:
- [ ] Customer list loads
- [ ] Correct columns display
- [ ] Lifetime value formatted as currency
- [ ] Pagination functional
- [ ] No console errors
```

---

## 🔍 Browser DevTools Verification

### Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Refresh page
4. Check requests:
   - [ ] Login requests should return token
   - [ ] Protected endpoints have `Authorization` header
   - [ ] All responses have 200/201 status (not 401/404)

### Console Tab
1. Open DevTools Console
2. Check for errors:
   - [ ] No `Uncaught TypeError` messages
   - [ ] No `404 Not Found` for API calls
   - [ ] No `CORS` errors
   - [ ] No `undefined` errors on render

### Storage Tab (Application)
1. Open DevTools
2. Go to Storage/Application tab
3. Check localStorage:
   - [ ] `token` key exists after login
   - [ ] Token value is not empty
   - [ ] Token persists after refresh

---

## 🔐 Authentication Verification

### Login Flow
```typescript
1. Navigate to login page
2. Enter test credentials
3. Click Login
4. Verify:
   - [ ] Token saved to localStorage
   - [ ] User redirected to dashboard
   - [ ] Auth state updated in store
```

### Token Usage
```javascript
// In console, after login
localStorage.getItem('token')
// Should return: "eyJ..."

// API calls should include token
// Check Network tab -> Headers -> Authorization: Bearer ...
```

### Logout Flow
```typescript
1. Click Logout
2. Verify:
   - [ ] Token removed from localStorage
   - [ ] Redirected to login page
   - [ ] Cannot access protected pages
```

---

## 📊 API Endpoint Verification

### Create a Checklist
```javascript
// In browser console, after login
const endpoints = [
  { method: 'GET', url: '/api/client/dashboard/stats', name: 'Dashboard Stats' },
  { method: 'GET', url: '/api/client/inventory', name: 'Inventory' },
  { method: 'GET', url: '/api/client/orders', name: 'Orders' },
  { method: 'GET', url: '/api/client/customers', name: 'Customers' },
]

for (const endpoint of endpoints) {
  fetch(endpoint.url, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  })
  .then(r => r.json())
  .then(d => console.log(`✅ ${endpoint.name}:`, d))
  .catch(e => console.log(`❌ ${endpoint.name}:`, e.message))
}
```

---

## 🚨 Common Issues & Fixes

### Issue: CORS Error
```
Access to XMLHttpRequest blocked by CORS
```
**Fix:**
```javascript
// Check server.js has correct origin
const allowedOrigins = ['http://localhost:5173']
app.use(cors({ origin: allowedOrigins }))
```

### Issue: 401 Unauthorized
```
Error: 401 Unauthorized
```
**Fix:**
```javascript
// Ensure token in localStorage
console.log(localStorage.getItem('token'))
// If empty, login again
```

### Issue: 404 Not Found
```
Error: 404 Not Found /api/client/orders
```
**Fix:**
```javascript
// Verify endpoint path matches service file
// Check server.js has route mounted
app.use('/api/client/orders', orderRoutes)
```

### Issue: Data Not Loading
```
Component stuck in loading state
```
**Fix:**
```javascript
// Check Network tab for pending requests
// Check browser console for errors
// Verify backend server is running
// Check database connection
```

### Issue: "Cannot read property of undefined"
```
TypeError: Cannot read property 'length' of undefined
```
**Fix:**
```javascript
// Add null check
{data && data.length > 0 ? <Table data={data} /> : null}
```

---

## 📈 Performance Verification

### Check Load Times
1. Open DevTools Network tab
2. Throttle to "Slow 3G"
3. Refresh page
4. Verify:
   - [ ] Initial load < 3 seconds
   - [ ] API calls < 1 second
   - [ ] No network errors
   - [ ] UI responsive during loading

### Check Memory Usage
1. Open DevTools Performance tab
2. Record page interaction
3. Stop recording
4. Verify:
   - [ ] No memory leaks
   - [ ] Memory usage stable
   - [ ] No repeated allocations

---

## 🎯 Final Verification Matrix

| Component | Tested | Status | Notes |
|-----------|--------|--------|-------|
| Server Health | [ ] | ⚪ | |
| Login Endpoint | [ ] | ⚪ | |
| Dashboard Stats | [ ] | ⚪ | |
| Inventory List | [ ] | ⚪ | |
| Orders List | [ ] | ⚪ | |
| Customers List | [ ] | ⚪ | |
| Token in Storage | [ ] | ⚪ | |
| Auth Header Sent | [ ] | ⚪ | |
| Error Handling | [ ] | ⚪ | |
| Pagination | [ ] | ⚪ | |
| Loading States | [ ] | ⚪ | |
| Error Messages | [ ] | ⚪ | |

---

## 🚀 Production Checklist

### Before Deployment
- [ ] All tests passing
- [ ] No console errors
- [ ] No API errors
- [ ] All endpoints verified
- [ ] Error handling working
- [ ] Loading states working
- [ ] Pagination working
- [ ] Authentication flow working
- [ ] Token refresh implemented
- [ ] Environment variables set
- [ ] API base URL correct
- [ ] CORS configured for production
- [ ] Rate limiting enabled
- [ ] Logging configured
- [ ] Monitoring set up

### After Deployment
- [ ] Verify production endpoints working
- [ ] Check error logs
- [ ] Monitor performance
- [ ] Test critical paths
- [ ] Verify backups working
- [ ] Check security headers

---

## 📞 Debugging Tips

### Enable Debug Logging
```javascript
// In api.ts
const logRequest = (endpoint, options) => {
  console.log(`[API] ${options.method} ${endpoint}`)
  console.log('Headers:', options.headers)
  console.log('Body:', options.body)
}
```

### Check Request Details
```javascript
// In Network tab, click request
// Check:
- Headers (including Authorization)
- Preview (response structure)
- Response (status code)
- Timing (request duration)
```

### Verify Service Imports
```javascript
// In browser console
import { orderService } from '@/services'
console.log(orderService)
// Should show all methods
```

---

## ✅ Sign-Off

Once all checks pass:
1. [ ] Integration complete
2. [ ] All endpoints working
3. [ ] Error handling implemented
4. [ ] Loading states working
5. [ ] Ready for feature development

**Date Verified:** ___________
**Verified By:** ___________
**Notes:** ___________

---

**Need Help?**
- Check `QUICK_REFERENCE.md` for quick commands
- See `CLIENT_SERVER_INTEGRATION_GUIDE.md` for detailed guide
- Review `INTEGRATION_COMPLETE.md` for full documentation
