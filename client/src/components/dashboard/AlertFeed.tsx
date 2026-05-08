import { AlertCircle, CheckCircle, Info } from 'lucide-react'

interface Alert {
  id: string
  type: 'error' | 'warning' | 'info' | 'success'
  title: string
  message: string
  timestamp: Date
}

interface AlertFeedProps {
  alerts?: Alert[]
  loading?: boolean
}

export function AlertFeed({ alerts = [], loading = false }: AlertFeedProps) {
  const getIcon = (type: Alert['type']) => {
    switch (type) {
      case 'error':
        return <AlertCircle size={20} className="text-red-600" />
      case 'warning':
        return <AlertCircle size={20} className="text-yellow-600" />
      case 'success':
        return <CheckCircle size={20} className="text-green-600" />
      default:
        return <Info size={20} className="text-blue-600" />
    }
  }

  const getColor = (type: Alert['type']) => {
    switch (type) {
      case 'error':
        return 'bg-red-50 border-red-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      case 'success':
        return 'bg-green-50 border-green-200'
      default:
        return 'bg-blue-50 border-blue-200'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Alerts</h3>
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading alerts...</div>
      ) : alerts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No alerts at the moment</div>
      ) : (
        <div className="space-y-3">
          {alerts.slice(0, 5).map((alert) => (
            <div key={alert.id} className={`border rounded-lg p-4 ${getColor(alert.type)}`}>
              <div className="flex items-start gap-3">
                {getIcon(alert.type)}
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {alert.timestamp.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
