import { useEffect, useState } from 'react'
import { DashboardLayout } from '../../layouts/DashboardLayout'
import { StatsCard } from '../../components/dashboard/StatsCard'
import { Widget } from '../../components/dashboard/Widget'
import { AlertFeed } from '../../components/dashboard/AlertFeed'
import { TrendingUp, Package, AlertCircle, Users } from 'lucide-react'

interface DashboardStats {
  revenue: number
  revenueChange: number
  orders: number
  ordersChange: number
  inventory: number
  inventoryChange: number
  activeSuppliers: number
  suppliersChange: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    revenue: 45230,
    revenueChange: 12,
    orders: 328,
    ordersChange: 8,
    inventory: 1240,
    inventoryChange: -3,
    activeSuppliers: 42,
    suppliersChange: 2,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      try {
        // API call to fetch dashboard stats
        // const response = await fetch('http://localhost:5000/api/dashboard/stats')
        // const data = await response.json()
        // setStats(data)
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Revenue"
            value={`$${stats.revenue.toLocaleString()}`}
            change={stats.revenueChange}
            icon={<TrendingUp className="w-6 h-6" />}
            loading={loading}
          />
          <StatsCard
            title="Orders"
            value={stats.orders}
            change={stats.ordersChange}
            icon={<Package className="w-6 h-6" />}
            loading={loading}
          />
          <StatsCard
            title="Inventory Items"
            value={stats.inventory}
            change={stats.inventoryChange}
            icon={<Package className="w-6 h-6" />}
            loading={loading}
          />
          <StatsCard
            title="Active Suppliers"
            value={stats.activeSuppliers}
            change={stats.suppliersChange}
            icon={<Users className="w-6 h-6" />}
            loading={loading}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Alerts */}
          <div className="lg:col-span-2">
            <Widget title="Recent Alerts" action="View All">
              <AlertFeed
                alerts={[
                  {
                    id: '1',
                    type: 'error',
                    title: 'Low Inventory Alert',
                    message: 'Product SKU-001 below reorder point',
                    timestamp: new Date(),
                  },
                  {
                    id: '2',
                    type: 'warning',
                    title: 'Supplier Delay',
                    message: 'Supplier ABC delayed shipment by 2 days',
                    timestamp: new Date(Date.now() - 3600000),
                  },
                  {
                    id: '3',
                    type: 'info',
                    title: 'New Order',
                    message: 'Order #12345 received from customer',
                    timestamp: new Date(Date.now() - 7200000),
                  },
                ]}
              />
            </Widget>
          </div>

          {/* Quick Actions */}
          <Widget title="Quick Actions">
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                New Order
              </button>
              <button className="w-full px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300">
                Check Inventory
              </button>
              <button className="w-full px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300">
                Contact Supplier
              </button>
            </div>
          </Widget>
        </div>
      </div>
    </DashboardLayout>
  )
}
