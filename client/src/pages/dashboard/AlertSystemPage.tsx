import { useEffect, useState } from 'react'
import { DashboardLayout } from '../../layouts/DashboardLayout'
import { Widget } from '../../components/dashboard/Widget'
import { Table } from '../../components/common/Table'
import { Button } from '../../components/common/Button'
import { AlertCircle, Bell, CheckCircle } from 'lucide-react'

interface Alert {
  id: string
  title: string
  type: 'error' | 'warning' | 'info' | 'success'
  description: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  createdAt: string
  resolved: boolean
}

interface NotificationSetting {
  id: string
  name: string
  enabled: boolean
  channels: string[]
  threshold?: number
}

export default function AlertSystemPage() {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      title: 'Critical Low Inventory',
      type: 'error',
      description: 'SKU-001 has fallen below critical level',
      severity: 'critical',
      createdAt: '2024-01-18T14:30:00',
      resolved: false,
    },
    {
      id: '2',
      title: 'Supplier Delay',
      type: 'warning',
      description: 'Supplier ABC has delayed shipment by 2 days',
      severity: 'high',
      createdAt: '2024-01-18T10:15:00',
      resolved: false,
    },
    {
      id: '3',
      title: 'High Churn Risk Customer',
      type: 'warning',
      description: 'Customer XYZ shows high churn risk score',
      severity: 'medium',
      createdAt: '2024-01-17T16:45:00',
      resolved: true,
    },
  ])

  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: '1',
      name: 'Inventory Alerts',
      enabled: true,
      channels: ['email', 'in-app'],
      threshold: 50,
    },
    {
      id: '2',
      name: 'Supplier Notifications',
      enabled: true,
      channels: ['email', 'sms', 'in-app'],
    },
    {
      id: '3',
      name: 'Customer Risk Alerts',
      enabled: false,
      channels: ['email'],
    },
    {
      id: '4',
      name: 'System Warnings',
      enabled: true,
      channels: ['in-app'],
    },
  ])

  const [loading, setLoading] = useState(false)

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
    return icons[type]
  }

  const handleResolveAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, resolved: true } : alert
      )
    )
  }

  const handleToggleSetting = (settingId: string) => {
    setSettings((prev) =>
      prev.map((setting) =>
        setting.id === settingId ? { ...setting, enabled: !setting.enabled } : setting
      )
    )
  }

  const activeAlerts = alerts.filter((a) => !a.resolved)
  const criticalAlerts = alerts.filter((a) => a.severity === 'critical' && !a.resolved)

  const columns = [
    {
      key: 'title',
      label: 'Alert',
      render: (val: string, item: Alert) => (
        <div className="flex items-start gap-2">
          {getTypeIcon(item.type)}
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
        <span className={`px-2 py-1 rounded text-sm font-medium ${getSeverityColor(val)}`}>
          {val}
        </span>
      ),
    },
    { key: 'createdAt', label: 'Time', render: (val: string) => new Date(val).toLocaleString() },
    {
      key: 'resolved',
      label: 'Action',
      render: (val: boolean, item: Alert) =>
        !val ? (
          <Button
            size="sm"
            onClick={() => handleResolveAlert(item.id)}
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
          <Widget title="Resolved">
            <p className="text-4xl font-bold text-green-600">
              {alerts.filter((a) => a.resolved).length}
            </p>
            <p className="text-sm text-gray-600 mt-2">Completed</p>
          </Widget>
        </div>

        {/* Recent Alerts */}
        <Widget title="Recent Alerts">
          <Table columns={columns} data={activeAlerts} loading={loading} />
        </Widget>

        {/* Notification Settings */}
        <Widget title="Notification Settings">
          <div className="space-y-4">
            {settings.map((setting) => (
              <div key={setting.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{setting.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Channels: {setting.channels.join(', ')}
                    {setting.threshold && ` • Threshold: ${setting.threshold}`}
                  </p>
                </div>
                <button
                  onClick={() => handleToggleSetting(setting.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    setting.enabled ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      setting.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </Widget>
      </div>
    </DashboardLayout>
  )
}
