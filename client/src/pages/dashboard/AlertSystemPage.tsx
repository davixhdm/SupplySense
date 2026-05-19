import { useState } from 'react'
import { DashboardLayout } from '../../layouts/DashboardLayout'
import { Widget } from '../../components/dashboard/Widget'
import { Table } from '../../components/common/Table'
import { Button } from '../../components/common/Button'
import { AlertCircle, Bell, CheckCircle, RefreshCw } from 'lucide-react'
import { alertService } from '../../services'
import { useApiPaginated } from '../../hooks'

interface Alert {
  id: string
  _id?: string
  title: string
  type?: 'error' | 'warning' | 'info' | 'success'
  description: string
  severity?: 'critical' | 'high' | 'medium' | 'low'
  createdAt: string
  resolved?: boolean
  isRead?: boolean
}

export default function AlertSystemPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch alerts using the hook
  const {
    data: alerts,
    loading: alertsLoading,
    error: alertsError,
    page,
    nextPage,
    prevPage,
    refetch,
  } = useApiPaginated(alertService.getAlerts, 1, 20)

  const handleMarkAsRead = async (alertId: string) => {
    try {
      setLoading(true)
      await alertService.markAsRead(alertId)
      refetch()
    } catch (err) {
      setError('Failed to mark alert as read')
    } finally {
      setLoading(false)
    }
  }

  const handleResolveAlert = async (alertId: string) => {
    try {
      setLoading(true)
      await alertService.markAsActioned(alertId)
      refetch()
    } catch (err) {
      setError('Failed to resolve alert')
    } finally {
      setLoading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      critical: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800',
    }
    return colors[severity] || 'bg-gray-100 text-gray-800'
  }

  const getTypeIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      error: <AlertCircle className="w-5 h-5 text-red-600" />,
      warning: <AlertCircle className="w-5 h-5 text-yellow-600" />,
      info: <Bell className="w-5 h-5 text-blue-600" />,
      success: <CheckCircle className="w-5 h-5 text-green-600" />,
    }
    return icons[type] || <Bell className="w-5 h-5 text-gray-600" />
  }

  const activeAlerts = alerts.filter((a) => !a.resolved)
  const criticalAlerts = alerts.filter((a) => a.severity === 'critical' && !a.resolved)

  const columns = [
    {
      key: 'title',
      label: 'Alert',
      render: (val: string, item: Alert) => (
        <div className="flex items-start gap-2">
          {getTypeIcon(item.type || 'info')}
          <div>
            <p className="font-medium text-gray-900">{val}</p>
            <p className="text-sm text-gray-600">{item.description}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'severity',
      label: 'Severity',
      render: (val: string) => (
        <span className={`px-2 py-1 rounded text-sm font-medium ${getSeverityColor(val || 'medium')}`}>
          {val || 'medium'}
        </span>
      ),
    },
    { 
      key: 'createdAt', 
      label: 'Time', 
      render: (val: string) => new Date(val).toLocaleString() 
    },
    {
      key: 'resolved',
      label: 'Action',
      render: (val: boolean, item: Alert) =>
        !val ? (
          <Button
            size="sm"
            onClick={() => handleResolveAlert(item.id || item._id)}
          >
            Resolve
          </Button>
        ) : (
          <span className="text-green-600 font-medium">Resolved</span>
        ),
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Error Display */}
        {(error || alertsError) && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex justify-between items-center">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800">{error || alertsError}</p>
            </div>
            <button
              onClick={refetch}
              className="text-red-600 hover:text-red-800 flex items-center gap-1"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        )}

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Alert System</h1>
          <p className="text-gray-600 mt-1">Manage your supply chain alerts and notifications</p>
        </div>

        {/* Critical Alerts Summary */}
        {criticalAlerts.length > 0 && (
          <div className="bg-red-50 border-l-4 border-red-600 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-red-900 text-lg">Critical Alerts</h3>
                <p className="text-red-700 text-sm mt-1">
                  You have {criticalAlerts.length} critical alert(s) requiring immediate attention.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Widget title="Total Alerts">
            <p className="text-4xl font-bold text-gray-900">{alerts.length}</p>
            <p className="text-sm text-gray-600 mt-2">All time</p>
          </Widget>
          <Widget title="Active Alerts">
            <p className="text-4xl font-bold text-orange-600">{activeAlerts.length}</p>
            <p className="text-sm text-gray-600 mt-2">Unresolved</p>
          </Widget>
          <Widget title="Critical">
            <p className="text-4xl font-bold text-red-600">{criticalAlerts.length}</p>
            <p className="text-sm text-gray-600 mt-2">Need action</p>
          </Widget>
        </div>

        {/* Recent Alerts */}
        <Widget title="Recent Alerts">
          {alertsLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : activeAlerts.length > 0 ? (
            <>
              <Table columns={columns} data={activeAlerts} />
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Page {page} | Alerts: {activeAlerts.length}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={prevPage}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <Button variant="secondary" onClick={nextPage}>
                    Next
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-500 py-8 text-center">No active alerts</p>
          )}
        </Widget>
      </div>
    </DashboardLayout>
  )
}
