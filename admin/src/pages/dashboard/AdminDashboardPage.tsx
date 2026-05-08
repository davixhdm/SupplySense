import { useEffect, useState } from 'react'
import { Building2, Key, Clock, Receipt, TrendingUp, Users } from 'lucide-react'
import StatsCard from '../../components/admin/StatsCard'
import { adminAuthService } from '../../services/adminAuthService'
import { adminAnalyticsService } from '../../services/adminAnalyticsService'
import { formatCurrency } from '../../utils/helpers'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminAnalyticsService.getPlatformAnalytics()
        setStats(data)
      } catch (err) {
        console.error('Failed to load stats:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Total Organizations"
          value={stats?.totalOrgs || 0}
          icon={Building2}
          color="blue"
        />
        <StatsCard
          title="Active Licenses"
          value={stats?.activeOrgs || 0}
          icon={Key}
          color="green"
        />
        <StatsCard
          title="Trial Organizations"
          value={stats?.trialOrgs || 0}
          icon={Clock}
          color="yellow"
        />
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(stats?.totalRevenue || 0)}
          icon={TrendingUp}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-4">Plan Distribution</h3>
          {stats?.planDistribution?.length ? (
            <div className="space-y-3">
              {stats.planDistribution.map((item: any) => (
                <div key={item._id} className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize">{item._id}</span>
                  <span className="text-sm text-gray-500">{item.count} orgs</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No data yet</p>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-4">Recent Payments</h3>
          {stats?.recentPayments?.length ? (
            <div className="space-y-3">
              {stats.recentPayments.slice(0, 5).map((payment: any) => (
                <div key={payment._id} className="flex items-center justify-between text-sm">
                  <span>{payment.organizationId?.organizationName || 'Unknown'}</span>
                  <span className="font-medium">{formatCurrency(payment.amount, payment.currency)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No payments yet</p>
          )}
        </div>
      </div>
    </div>
  )
}