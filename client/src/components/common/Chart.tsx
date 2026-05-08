import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface ChartProps {
  title: string
  data?: unknown[]
  loading?: boolean
  type?: 'line' | 'bar'
  dataKey?: string
  xAxisKey?: string
}

export function Chart({
  title,
  data,
  loading = false,
  type = 'line',
  dataKey = 'value',
  xAxisKey = 'name',
}: ChartProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {loading ? (
        <div className="h-64 flex items-center justify-center text-gray-500">
          Loading chart...
        </div>
      ) : data && data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          {type === 'bar' ? (
            <BarChart data={data as any}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxisKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={dataKey} fill="#3b82f6" />
            </BarChart>
          ) : (
            <LineChart data={data as any}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxisKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke="#3b82f6"
                dot={{ fill: '#3b82f6' }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      ) : (
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
          <p className="text-gray-500">No chart data available</p>
        </div>
      )}
    </div>
  )
}

