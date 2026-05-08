import { useState, useEffect } from 'react'
import { systemLogsService } from '../../services/systemLogsService'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import { Search } from 'lucide-react'
import { formatDate } from '../../utils/helpers'

export default function SystemLogsPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const res = await systemLogsService.getAll({ search: search || undefined, limit: '50' })
      setLogs(res.logs || [])
    } catch (err) {
      console.error('Failed to load logs:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchLogs() }, [])

  const severityColors: Record<string, string> = {
    info: 'bg-blue-100 text-blue-800',
    warning: 'bg-yellow-100 text-yellow-800',
    critical: 'bg-red-100 text-red-800'
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">System Logs</h1>

      <div className="flex gap-2 mb-6">
        <Input placeholder="Search logs..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <Button onClick={fetchLogs}><Search size={16} /></Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs">Action</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs">Severity</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs">User</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {logs.map((log) => (
                <tr key={log._id}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-xs">{log.action}</p>
                    <p className="text-xs text-gray-400">{log.description}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${severityColors[log.severity] || ''}`}>
                      {log.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{log.performedBy?.fullName || log.performedBy?.email || 'System'}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{formatDate(log.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}