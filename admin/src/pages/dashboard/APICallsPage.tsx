import { useState, useEffect } from 'react'
import { systemLogsService } from '../../services/systemLogsService'
import Table from '../../components/common/Table'
import { formatDate } from '../../utils/helpers'
import { Activity, Server, Users, BarChart3 } from 'lucide-react'

export default function APICallsPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, aiCalls: 0, uniqueUsers: 0, todayCalls: 0 })

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const res = await systemLogsService.getAll({ actionType: 'system_event', limit: '100' })
      const allLogs = res.logs || []
      const aiLogs = allLogs.filter((l: any) => 
        l.description?.includes('AI') || l.description?.includes('insight') || l.description?.includes('prediction') || l.actionType === 'system_event'
      )
      setLogs(aiLogs)

      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const todayLogs = aiLogs.filter((l: any) => new Date(l.createdAt) >= today)

      const uniqueUsers = new Set(aiLogs.map((l: any) => l.performedBy?._id || l.performedBy)).size

      setStats({
        total: aiLogs.length,
        aiCalls: aiLogs.length,
        uniqueUsers,
        todayCalls: todayLogs.length
      })
    } catch (err) {
      console.error('Failed to load API logs:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchLogs() }, [])

  const columns = [
    { key: 'description', header: 'Action', render: (l: any) => (
      <div>
        <p className="text-sm font-medium">{l.action}</p>
        <p className="text-xs text-gray-500">{l.description}</p>
      </div>
    )},
    { key: 'performedBy', header: 'User', render: (l: any) => (
      <span className="text-sm">{l.performedBy?.fullName || l.performedBy?.email || 'System'}</span>
    )},
    { key: 'ipAddress', header: 'IP', render: (l: any) => <span className="text-xs font-mono">{l.ipAddress || '—'}</span> },
    { key: 'createdAt', header: 'Date', render: (l: any) => <span className="text-xs">{formatDate(l.createdAt)}</span> },
    { key: 'severity', header: 'Status', render: (l: any) => (
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${l.severity === 'info' ? 'bg-blue-100 text-blue-800' : l.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
        {l.severity || 'info'}
      </span>
    )}
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">API Calls Monitor</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl"><Activity size={24} className="text-blue-600" /></div>
          <div><p className="text-sm text-gray-500">Total API Calls</p><p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</p></div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 flex items-center gap-4">
          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl"><Server size={24} className="text-purple-600" /></div>
          <div><p className="text-sm text-gray-500">AI Engine Calls</p><p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.aiCalls}</p></div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 flex items-center gap-4">
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl"><Users size={24} className="text-green-600" /></div>
          <div><p className="text-sm text-gray-500">Unique Users</p><p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.uniqueUsers}</p></div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 flex items-center gap-4">
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl"><BarChart3 size={24} className="text-yellow-600" /></div>
          <div><p className="text-sm text-gray-500">Today's Calls</p><p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.todayCalls}</p></div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <Table columns={columns} data={logs} loading={loading} emptyMessage="No API calls recorded yet" />
      </div>
    </div>
  )
}