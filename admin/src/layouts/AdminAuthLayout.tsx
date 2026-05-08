import { Outlet } from 'react-router-dom'

export default function AdminAuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary-600">SupplySense</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Admin Portal</p>
        </div>
        <Outlet />
      </div>
    </div>
  )
}