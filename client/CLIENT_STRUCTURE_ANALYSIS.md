# SupplySense Client Frontend - Structure Analysis

## 📋 Project Overview

**Client Frontend** is the customer-facing React + Vite application for SupplySense. It serves both:
1. **Landing Pages** - Public pages (login, registration, pricing, license activation)
2. **Dashboard** - Authenticated dashboard for supply chain management

**Tech Stack:**
- React 18+ with Vite
- TypeScript (TSX)
- Tailwind CSS for styling
- State Management (Zustand-like store)
- Custom Hooks for logic

---

## 📁 Directory Structure Breakdown

### 1. **public/** - Static Assets
```
├── favicon.ico      # Browser tab icon
└── logo.svg         # SupplySense logo
```

### 2. **src/assets/** - Images & Styles
```
├── images/          # Product screenshots, icons, illustrations
└── styles/
    └── index.css    # Global Tailwind configuration
```

### 3. **src/components/** - Reusable React Components

#### **common/** (7 components) - UI library used everywhere
```
├── Button.tsx       # Primary, secondary, loading states
├── Input.tsx        # Text input with validation
├── Modal.tsx        # Dialog/popup component
├── Loader.tsx       # Loading spinner
├── Table.tsx        # Data table with pagination, sorting
├── Chart.tsx        # Charts (using Chart.js or Recharts)
└── AlertBanner.tsx  # Success/error/warning notifications
```

#### **landing/** (5 components) - Public pages
```
├── Navbar.tsx               # Top navigation with login/signup links
├── Hero.tsx                 # Homepage hero section
├── PlanCard.tsx             # Pricing plan display (Free, Standard, Pro+)
├── PaymentInstructions.tsx  # How to pay instructions
└── Footer.tsx               # Footer with links
```

#### **dashboard/** (5 components) - Dashboard-specific UI
```
├── Sidebar.tsx      # Left navigation (Products, Orders, Suppliers, etc.)
├── Topbar.tsx       # Top bar (user profile, logout, settings)
├── StatsCard.tsx    # KPI cards (Total Revenue, Active Orders, etc.)
├── AlertFeed.tsx    # Real-time alert notifications
└── Widget.tsx       # Customizable dashboard widgets
```

---

### 4. **src/layouts/** (2 layouts) - Page Wrappers
```
├── AuthLayout.tsx       # Layout for login/register pages (no sidebar)
└── DashboardLayout.tsx  # Layout for authenticated pages (with sidebar + topbar)
```

---

### 5. **src/pages/** - Full Page Components

#### **landing/** - Public pages
```
├── LandingPage.tsx      # Home page (hero + features + CTA)
├── LoginPage.tsx        # Email/password login + device tracking
├── RegisterPage.tsx     # Sign up with license key
└── LicenseKeyPage.tsx   # Activate trial with license key
```

#### **dashboard/** - Authenticated pages
```
├── DashboardPage.tsx        # Main dashboard with KPIs and charts
├── TransactionsPage.tsx     # View all transactions (filter, export)
├── OrdersPage.tsx           # Order management (create, track, AI predictions)
├── InventoryPage.tsx        # Stock levels + stockout predictions
├── SuppliersPage.tsx        # Supplier profiles + reliability scores
├── CustomersPage.tsx        # Customer list + churn risk + segmentation
├── EmployeesPage.tsx        # Team management
├── AIInsightsPage.tsx       # Chat with AI for data insights
├── AlertSystemPage.tsx      # Configure & view alerts (email, SMS)
└── settings/
    ├── CompanyInfoPage.tsx  # Organization details
    ├── PreferencesPage.tsx  # UI preferences (theme, timezone)
    ├── UsersPage.tsx        # Team members + permissions
    ├── DevicesPage.tsx      # Registered devices (device limit by plan)
    └── BackupPage.tsx       # Database backup & restore
```

---

### 6. **src/hooks/** (3 custom hooks) - React Logic
```
├── useAuth.ts           # Auth state, login/logout, check license validity
├── useDeviceCheck.ts    # Verify device is registered (plan-based limit)
└── useFetch.ts          # Wrapper around fetch API with error handling
```

---

### 7. **src/services/** (12 API integrations) - API Calls
```
├── api.ts                  # Base API configuration (headers, auth token)
├── authService.ts          # Login, register, validate license, logout
├── dashboardService.ts     # Fetch KPI data for dashboard
├── transactionService.ts   # GET/POST transactions
├── orderService.ts         # GET/POST orders + AI predictions
├── inventoryService.ts     # Stock levels + predictions
├── supplierService.ts      # Supplier profiles + reliability scores
├── customerService.ts      # Customer data + churn risk
├── employeeService.ts      # Team management
├── aiInsightsService.ts    # Chat with AI backend
├── alertService.ts         # Configure alerts (email, SMS, WhatsApp)
└── settingsService.ts      # Company info, preferences, users, devices
```

**All services connect to Backend API:**
```
Base URL: http://localhost:5000/api/v1/client/
(or production URL when deployed)
```

---

### 8. **src/store/** (3 state stores) - Global State Management
```
├── authStore.ts         # Current user, auth status, license info
├── dashboardStore.ts    # Dashboard data (KPIs, charts, filters)
└── alertStore.ts        # Alert notifications (real-time updates)
```

---

### 9. **src/utils/** (3 helpers) - Utility Functions
```
├── constants.ts         # Hardcoded values (plan names, alert types, etc.)
├── helpers.ts           # Format currency, date, truncate text, etc.
└── validators.ts        # Email, phone, password validation
```

---

### 10. **Entry Points**
```
├── App.tsx              # Main component (routing, theme provider)
├── main.tsx             # React DOM render
└── index.html           # Root HTML file
```

---

### 11. **Configuration Files**
```
├── .env                 # Environment variables (API URL, keys)
├── package.json         # Dependencies (React, Vite, Tailwind, etc.)
├── vite.config.ts       # Vite build configuration
├── tsconfig.json        # TypeScript configuration
├── tailwind.config.ts   # Tailwind CSS customization
└── postcss.config.js    # PostCSS configuration for Tailwind
```

---

## 🔄 Data Flow

```
Landing Page (Public)
    ↓
[Login/Register] → Backend Auth → JWT Token → LocalStorage
    ↓
Dashboard (Protected)
    ↓
[Pages] (Orders, Inventory, Suppliers, etc.)
    ↓
[Services] → API calls + auth header
    ↓
[Backend] → Database + AI Engine
    ↓
[Response] → [Store] (Global state)
    ↓
[Components] render data from store
```

---

## 📊 Plan-Based Feature Access

The frontend respects plan tiers (FREE TRIAL, STANDARD, PRO+):

| Feature | FREE TRIAL | STANDARD | PRO+ |
|---------|-----------|----------|------|
| Dashboard | Basic | Full | Full + Custom widgets |
| Orders | Basic tracking | Full + AI predictions | Full + API auto-sync |
| Inventory | Basic stock | Full + Predictions | Full + Multi-warehouse |
| AI Insights | ❌ | 5 queries/month | Unlimited |
| Alerts | Dashboard only | Email | Email + SMS + WhatsApp |
| Users | 1 | Up to 10 | Unlimited |
| Devices | 1 | Up to 3 | Up to 5 |

---

## 🔐 Security & Auth Flow

1. **License Key Activation**
   - New user enters license key
   - Backend validates against License key table
   - Subscription tier assigned

2. **Device Tracking**
   - Each login device is tracked
   - Limit enforced (1, 3, or 5 per plan)
   - Admin can view/manage devices

3. **Token Management**
   - JWT stored in localStorage
   - Sent with every API request
   - Refreshes on 401 Unauthorized

4. **Role-Based Access** (Server enforces)
   - Frontend hides UI elements based on plan
   - Backend validates actual permissions

---

## 🚀 Key Components to Build

### **Phase 1: Landing Pages**
- [ ] Navbar (with login/signup links)
- [ ] Hero section
- [ ] Pricing table (Free, Standard, Pro+)
- [ ] Login page (email + password)
- [ ] Register page (with license key input)
- [ ] License key activation page
- [ ] Footer

### **Phase 2: Dashboard Core**
- [ ] Authentication wrapper (useAuth hook)
- [ ] Dashboard layout (Sidebar + Topbar)
- [ ] Main dashboard page with KPIs
- [ ] Navigation menu

### **Phase 3: Main Modules**
- [ ] Orders page
- [ ] Inventory page
- [ ] Suppliers page
- [ ] Customers page
- [ ] Transactions page

### **Phase 4: Advanced Features**
- [ ] AI Insights page (chatbot)
- [ ] Alert system configuration
- [ ] Employee management
- [ ] Settings pages (company info, users, devices, backup)

### **Phase 5: Polish**
- [ ] Responsive design
- [ ] Error handling
- [ ] Loading states
- [ ] Form validation
- [ ] Real-time notifications

---

## 🔌 Backend API Requirements

The frontend expects these endpoint categories from Backend:

1. **Auth** - `/api/v1/auth/login`, `/register`, `/validate-license`
2. **Dashboard** - `/api/v1/dashboard/stats`
3. **Orders** - `/api/v1/orders/`, `/orders/:id`, `/orders/predict`
4. **Inventory** - `/api/v1/inventory/`, `/predictions`
5. **Suppliers** - `/api/v1/suppliers/`, `/scoring`
6. **Customers** - `/api/v1/customers/`, `/churn-risk`
7. **Transactions** - `/api/v1/transactions/`
8. **Alerts** - `/api/v1/alerts/`, `/configure`
9. **AI Insights** - `/api/v1/ai/chat`
10. **Settings** - `/api/v1/settings/`, `/users`, `/devices`, `/backup`

---

## 💡 Next Steps

1. **Initialize Vite project** - Create React app with Vite
2. **Install dependencies** - React, Tailwind, Axios, Zustand, React Router
3. **Set up TypeScript** - Configure tsconfig
4. **Build common components** - Button, Input, Modal, Table, Chart
5. **Create layouts** - AuthLayout, DashboardLayout
6. **Build landing pages** - Login, Register, License key pages
7. **Connect to Backend API** - Set up services and hooks
8. **Build dashboard pages** - Dashboard, Orders, Inventory, etc.
9. **Add state management** - Zustand stores
10. **Polish & deploy** - Responsive design, error handling, deployment

---

## 📌 Current Status

- ✅ **AI Engine**: COMPLETE (200/200 tests passing)
- ⏳ **Client Frontend**: READY TO BUILD
- ⏳ **Backend Server**: To be built

**Your Next Task**: Start building the Client Frontend

---

## 🎯 Recommended Start

1. Initialize the Vite React project
2. Set up folder structure
3. Build reusable components (Button, Input, Modal, Table, Chart)
4. Create landing page layout
5. Create auth pages (Login, Register)
6. Connect to Backend API

Would you like me to help scaffold the initial Vite project?
