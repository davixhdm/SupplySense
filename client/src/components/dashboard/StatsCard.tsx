import { ReactNode } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: ReactNode
  change?: number
  changeType?: 'increase' | 'decrease'
  bgColor?: string
}

export function StatsCard({
  title,
  value,
  icon,
  change,
  changeType = 'increase',
  bgColor = 'bg-blue-50',
}: StatsCardProps) {
  return (
    <div className={`${bgColor} rounded-lg p-6 shadow-sm`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {changeType === 'increase' ? (
                <TrendingUp size={16} className="text-green-600" />
              ) : (
                <TrendingDown size={16} className="text-red-600" />
              )}
              <span className={changeType === 'increase' ? 'text-green-600' : 'text-red-600'}>
                {Math.abs(change)}%
              </span>
            </div>
          )}
        </div>
        <div className="text-4xl opacity-20">{icon}</div>
      </div>
    </div>
  )
}
