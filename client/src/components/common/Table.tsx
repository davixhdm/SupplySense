interface Column {
  key: string
  label: string
  render?: (value: unknown) => React.ReactNode
}

interface TableProps {
  columns: Column[]
  data: Record<string, unknown>[]
  loading?: boolean
}

export function Table({ columns, data, loading = false }: TableProps) {
  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (data.length === 0) {
    return <div className="text-center py-8 text-gray-500">No data available</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-100 border-b">
            {columns.map((col) => (
              <th key={col.key} className="px-6 py-3 text-left text-sm font-semibold">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="border-b hover:bg-gray-50">
              {columns.map((col) => (
                <td key={col.key} className="px-6 py-3 text-sm">
                  {col.render ? col.render(row[col.key]) : String(row[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
