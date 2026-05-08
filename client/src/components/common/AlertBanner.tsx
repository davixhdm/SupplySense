import { X, AlertCircle, CheckCircle, InfoIcon } from 'lucide-react'

interface AlertBannerProps {
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  onClose?: () => void
  dismissible?: boolean
}

export function AlertBanner({ type, message, onClose, dismissible = true }: AlertBannerProps) {
  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  }

  const icons = {
    success: <CheckCircle size={20} />,
    error: <AlertCircle size={20} />,
    warning: <AlertCircle size={20} />,
    info: <InfoIcon size={20} />,
  }

  return (
    <div className={`flex items-center gap-3 p-4 rounded-lg border ${styles[type]}`}>
      {icons[type]}
      <span className="flex-1">{message}</span>
      {dismissible && (
        <button onClick={onClose} className="text-current hover:opacity-70">
          <X size={20} />
        </button>
      )}
    </div>
  )
}
