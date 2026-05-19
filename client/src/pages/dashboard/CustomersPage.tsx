import { useState } from 'react'
import { DashboardLayout } from '../../layouts/DashboardLayout'
import { Widget } from '../../components/dashboard/Widget'
import { Table } from '../../components/common/Table'
import { Input } from '../../components/common/Input'
import { Button } from '../../components/common/Button'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { customerService } from '../../services'
import { useApiPaginated } from '../../hooks'

interface Customer {
  id: string
  _id?: string
  name: string
  email: string
  phone: string
  totalOrders: number
  totalValue: number
  churnRisk?: 'low' | 'medium' | 'high'
  segment?: string
  lastOrderDate: string
}

export default function CustomersPage() {
  const [search, setSearch] = useState('')

  // Fetch customers using the hook
  const {
    data: customers,
    loading,
    error,
    page,
    nextPage,
    prevPage,
    refetch,
  } = useApiPaginated(customerService.getCustomers, 1, 20)

  const getChurnRiskColor = (risk?: string) => {
    const colors: Record<string, string> = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800',
    }
    return colors[risk || 'low'] || 'bg-gray-100 text-gray-800'
  }

  const columns = [
    { key: 'name', label: 'Customer Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'totalOrders', label: 'Total Orders' },
    {
      key: 'totalSpent',
      label: 'Lifetime Value',
      render: (val: number) => `$${(val || 0).toLocaleString()}`,
    },
    { key: 'lastOrderDate', label: 'Last Order' },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex justify-between items-center">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800">{error}</p>
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
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Customers</h1>
          <Button variant="primary">Add Customer</Button>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <Input
            type="text"
            placeholder="Search customers by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Customers Table */}
        <Widget title="Customers">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : customers && customers.length > 0 ? (
            <>
              <Table data={customers} columns={columns} />
              <div className="mt-4 flex justify-between items-center border-t pt-4">
                <span className="text-sm text-gray-600">
                  Page {page} | Showing {customers.length} customers
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
            <p className="text-gray-500 py-8 text-center">No customers found</p>
          )}
        </Widget>
      </div>
    </DashboardLayout>
  )
}
            <option>Startup</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-gray-900">
            <option>All Churn Risks</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        {/* Customers Table */}
        <Widget title="Customers">
          <Table columns={columns} data={customers} loading={loading} />
        </Widget>

        {/* Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Widget title="Total Customers">
            <p className="text-4xl font-bold text-gray-900">248</p>
            <p className="text-sm text-gray-600 mt-2">+12 this month</p>
          </Widget>
          <Widget title="Avg Order Value">
            <p className="text-4xl font-bold text-gray-900">$3,245</p>
            <p className="text-sm text-gray-600 mt-2">+5% vs last month</p>
          </Widget>
          <Widget title="High Risk Customers">
            <p className="text-4xl font-bold text-red-600">18</p>
            <p className="text-sm text-gray-600 mt-2">7.3% of customer base</p>
          </Widget>
        </div>
      </div>
    </DashboardLayout>
  )
}
