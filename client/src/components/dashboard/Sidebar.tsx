import { Link } from 'react-router-dom'
import { BarChart3, Package, TrendingUp, Users, Settings, AlertCircle } from 'lucide-react'

export function Sidebar() {
  const menuItems = [
    { label: 'Dashboard', icon: BarChart3, href: '/dashboard' },
    { label: 'Orders', icon: Package, href: '/dashboard/orders' },
    { label: 'Inventory', icon: TrendingUp, href: '/dashboard/inventory' },
    { label: 'Suppliers', icon: Users, href: '/dashboard/suppliers' },
    { label: 'Customers', icon: Users, href: '/dashboard/customers' },
    { label: 'Alerts', icon: AlertCircle, href: '/dashboard/alerts' },
    { label: 'Settings', icon: Settings, href: '/dashboard/settings' },
  ]

  return (
    <div className="w-64 bg-gray-900 text-white h-screen overflow-y-auto fixed left-0 top-0">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-blue-400">SupplySense</h1>
      </div>
      <nav className="p-4">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.label}
              to={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
