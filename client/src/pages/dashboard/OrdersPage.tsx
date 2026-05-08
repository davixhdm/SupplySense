import { useEffect, useState } from 'react'
import { DashboardLayout } from '../../layouts/DashboardLayout'
import { Widget } from '../../components/dashboard/Widget'
import { Table } from '../../components/common/Table'
import { Input } from '../../components/common/Input'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'

interface Order {
  id: string
  orderNumber: string
  customer: string
  amount: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered'
  riskPrediction: 'low' | 'medium' | 'high'
  date: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      orderNumber: 'ORD-001',
      customer: 'ACME Corp',
      amount: 2500,
      status: 'delivered',
      riskPrediction: 'low',
      date: '2024-01-15',
    },
    {
      id: '2',
      orderNumber: 'ORD-002',
      customer: 'TechStart Inc',
      amount: 5300,
      status: 'shipped',
      riskPrediction: 'medium',
      date: '2024-01-14',
    },
    {
      id: '3',
      orderNumber: 'ORD-003',
      customer: 'Global Trade Ltd',
      amount: 1800,
      status: 'confirmed',
      riskPrediction: 'high',
      date: '2024-01-13',
    },
  ])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Fetch orders from API
  }, [])

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
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <Button onClick={() => {}}>New Order</Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Search Orders"
            type="text"
            placeholder="Order #, customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-gray-900">
            <option>All Statuses</option>
            <option>Pending</option>
            <option>Confirmed</option>
            <option>Shipped</option>
            <option>Delivered</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-gray-900">
            <option>All Risk Levels</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        {/* Orders Table */}
        <Widget title="Orders">
          <Table columns={columns} data={orders} loading={loading} />
        </Widget>
      </div>
    </DashboardLayout>
  )
}
