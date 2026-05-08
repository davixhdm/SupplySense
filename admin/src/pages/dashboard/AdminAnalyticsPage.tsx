import { useState, useEffect } from 'react'
import { adminAnalyticsService } from '../../services/adminAnalyticsService'
import Chart from '../../components/common/Chart'
import { formatCurrency } from '../../utils/helpers'
import { PLAN_LABELS } from '../../utils/constants'

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await adminAnalyticsService.getPlatformAnalytics()
        setData(res)
      } catch (err) {
        console.error('Failed to load analytics:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>
    )
  }

  const planChartData = data?.planDistribution?.map((p: any) => ({
    name: PLAN_LABELS[p._id] || p._id,
    value: p.count
  })) || []

  const revenueData = data?.recentPayments?.map((p: any) => ({
    name: p.organizationId?.organizationName || 'Unknown',
    amount: p.amount
  })) || []

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4">Plan Distribution</h3>
          <Chart type="pie" data={planChartData} dataKeys={['value']} height={280} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4">Recent Revenue</h3>
          <Chart type="bar" data={revenueData} dataKeys={['amount']} height={280} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4">Platform Overview</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{data?.totalOrgs || 0}</p>
              <p className="text-xs text-gray-500">Total Orgs</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{data?.activeOrgs || 0}</p>
              <p className="text-xs text-gray-500">Active</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{data?.trialOrgs || 0}</p>
              <p className="text-xs text-gray-500">Trials</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(data?.totalRevenue || 0)}</p>
              <p className="text-xs text-gray-500">Revenue</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}