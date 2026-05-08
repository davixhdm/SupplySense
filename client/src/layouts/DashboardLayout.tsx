import { Sidebar } from '../components/dashboard/Sidebar'
import { Topbar } from '../components/dashboard/Topbar'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div>
      <Sidebar />
      <div className="ml-64">
        <Topbar />
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
