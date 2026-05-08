import { useAuthStore } from '../../store/authStore'
import { LogOut, User } from 'lucide-react'

export function Topbar() {
  const { user, logout } = useAuthStore()

  return (
    <div className="bg-white border-b shadow-sm sticky top-0 z-40">
      <div className="flex justify-between items-center px-8 py-4 ml-64">
        <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-medium text-gray-900">{user?.email}</p>
            <p className="text-sm text-gray-600">{user?.role}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <User size={20} />
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}
