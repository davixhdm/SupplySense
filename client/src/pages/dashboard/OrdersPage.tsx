import { useState } from 'react'
import { DashboardLayout } from '../../layouts/DashboardLayout'
import { Widget } from '../../components/dashboard/Widget'
import { Table } from '../../components/common/Table'
import { Input } from '../../components/common/Input'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { orderService } from '../../services'
import { useApiPaginated } from '../../hooks'

interface Order {
  id: string
  _id?: string
  orderNumber: string
  customer: string
  amount: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered'
  riskPrediction: 'low' | 'medium' | 'high'
  date: string
}

export default function OrdersPage() {
  const [search, setSearch] = useState('')

  // Fetch orders using the hook
  const {
    data: orders,
    loading,
    error,
    page,
    nextPage,
    prevPage,
    refetch,
  } = useApiPaginated(orderService.getOrders, 1, 20)

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getRiskColor = (risk: string) => {
    const colors: Record<string, string> = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800',
    }
    return colors[risk] || 'bg-gray-100 text-gray-800'
  }

  const columns = [
    { key: 'orderNumber', label: 'Order #' },
    { key: 'customer', label: 'Customer' },
    { key: 'amount', label: 'Amount', render: (val: number) => `$${val}` },
    {
      key: 'status',
      label: 'Status',
      render: (val: string) => (
        <span className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(val)}`}>
          {val}
        </span>
      ),
    },
    {
      key: 'riskPrediction',
      label: 'Fulfillment Risk',
      render: (val: string) => (
        <span className={`px-2 py-1 rounded text-sm font-medium ${getRiskColor(val)}`}>
          {val}
        </span>
      ),
    },
    { key: 'date', label: 'Date' },
  ]

  return (
    // After getting orders
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
          <h1 className="text-3xl font-bold">Orders</h1>
          <Button variant="primary">New Order</Button>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <Input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Orders Table */}
        <Widget title="Recent Orders">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : orders && orders.length > 0 ? (
            <>
              <Table data={orders} columns={columns} />
              <div className="mt-4 flex justify-between items-center border-t pt-4">
                <span className="text-sm text-gray-600">
                  Page {page} | Showing {orders.length} orders
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
            <p className="text-gray-500 py-8 text-center">No orders found</p>
          )}
        </Widget>
      </div>
    </DashboardLayout>
  )
}
