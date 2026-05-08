interface WidgetProps {
  title: string
  children: React.ReactNode
  action?: {
    label: string
    onClick: () => void
  }
}

export function Widget({ title, children, action }: WidgetProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {action && (
          <button
            onClick={action.onClick}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {action.label}
          </button>
        )}
      </div>
      {children}
    </div>
  )
}
