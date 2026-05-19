import { useEffect, useState } from 'react'
import { DashboardLayout } from '../../layouts/DashboardLayout'
import { StatsCard } from '../../components/dashboard/StatsCard'
import { Widget } from '../../components/dashboard/Widget'
import { AlertFeed } from '../../components/dashboard/AlertFeed'
import { TrendingUp, Package, AlertCircle, Users, RefreshCw } from 'lucide-react'
import { dashboardService, alertService } from '../../services'
import { useApi } from '../../hooks'

interface DashboardStats {
  totalRevenue?: number
  totalOrders?: number
  totalInventory?: number
  activeSuppliers?: number
  stats?: any
}

export default function DashboardPage() {
  // Fetch dashboard stats using the custom hook
  const {
    data: statsData,
    loading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useApi(() => dashboardService.getStats(), [])

  // Fetch alerts using the custom hook
  const {
    data: alertsData,
    loading: alertsLoading,
    error: alertsError,
  } = useApi(() => alertService.getAlerts(1, 10), [])

  // Transform API data to component format
  const stats: DashboardStats = {
    totalRevenue: statsData?.stats?.totalRevenue || 0,
    totalOrders: statsData?.stats?.totalOrders || 0,
    totalInventory: statsData?.stats?.totalInventory || 0,
    activeSuppliers: statsData?.stats?.activeSuppliers || 0,
  }

  const loading = statsLoading || alertsLoading
  const error = statsError || alertsError

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex justify-between items-center">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800">{error}</p>
            </div>
            <button
              onClick={refetchStats}
              className="text-red-600 hover:text-red-800 flex items-center gap-1"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Revenue"
            value={`$${(stats.totalRevenue || 0).toLocaleString()}`}
            change={12}
            icon={<TrendingUp className="w-6 h-6" />}
            loading={loading}
          />
          <StatsCard
            title="Total Orders"
            value={stats.totalOrders || 0}
            change={8}
            icon={<Package className="w-6 h-6" />}
            loading={loading}
          />
          <StatsCard
            title="Inventory Items"
            value={stats.totalInventory || 0}
            change={-3}
            icon={<Package className="w-6 h-6" />}
            loading={loading}
          />
          <StatsCard
            title="Active Suppliers"
            value={stats.activeSuppliers || 0}
            change={2}
            icon={<Users className="w-6 h-6" />}
            loading={loading}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Alerts */}
          <div className="lg:col-span-2">
            <Widget title="Recent Alerts" action="View All">
              {alertsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : alertsData?.data && alertsData.data.length > 0 ? (
                <AlertFeed
                  alerts={alertsData.data.map((alert: any) => ({
                    id: alert._id || alert.id,
                    type: alert.severity || 'info',
                    title: alert.title,
                    message: alert.message,
                    timestamp: new Date(alert.createdAt),
                  }))}
                />
              ) : (
                <p className="text-gray-500 py-8 text-center">No alerts at the moment</p>
              )}
            </Widget>
          </div>

          {/* Quick Actions */}
          <Widget title="Quick Actions">
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                New Order
              </button>
              <button className="w-full px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition">
                Check Inventory
              </button>
              <button className="w-full px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition">
                Contact Supplier
              </button>
            </div>
          </Widget>
        </div>
      </div>
    </DashboardLayout>
  )
}
