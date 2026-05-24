import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Building2, Receipt, ScrollText,
  BarChart3, Settings, Activity
} from 'lucide-react'
import { useAdminDashboardStore } from '../store/adminDashboardStore'
import { classNames } from '../utils/helpers'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/applications', icon: Building2, label: 'Applications' },
  { to: '/admin/payments', icon: Receipt, label: 'Payments' },
  { to: '/admin/logs', icon: ScrollText, label: 'System Logs' },
  { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/admin/api-calls', icon: Activity, label: 'API Calls' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useAdminDashboardStore()

  return (
    <aside className={classNames('fixed left-0 top-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-40 transition-all duration-300 flex flex-col', sidebarCollapsed ? 'w-20' : 'w-64')}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800">
        {!sidebarCollapsed && <span className="text-lg font-bold text-primary-600">SupplySense</span>}
        <button onClick={toggleSidebar} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
          {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              classNames(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
                sidebarCollapsed && 'justify-center px-2'
              )
            }
          >
            <item.icon size={20} />
            {!sidebarCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}