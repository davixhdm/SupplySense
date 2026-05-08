import { useEffect, useState } from 'react'
import { DashboardLayout } from '../../layouts/DashboardLayout'
import { Widget } from '../../components/dashboard/Widget'
import { Table } from '../../components/common/Table'
import { Input } from '../../components/common/Input'
import { Button } from '../../components/common/Button'
import { AlertCircle } from 'lucide-react'

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  totalOrders: number
  totalValue: number
  churnRisk: 'low' | 'medium' | 'high'
  segment: string
  lastOrderDate: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: '1',
      name: 'ACME Corporation',
      email: 'contact@acme.com',
      phone: '+1-555-0101',
      totalOrders: 24,
      totalValue: 125000,
      churnRisk: 'low',
      segment: 'Enterprise',
      lastOrderDate: '2024-01-15',
    },
    {
      id: '2',
      name: 'TechStart Inc',
      email: 'sales@techstart.com',
      phone: '+1-555-0102',
      totalOrders: 8,
      totalValue: 42500,
      churnRisk: 'high',
      segment: 'SMB',
      lastOrderDate: '2023-12-20',
    },
    {
      id: '3',
      name: 'Global Trade Ltd',
      email: 'procurement@globaltrade.com',
      phone: '+44-20-1234-5678',
      totalOrders: 156,
      totalValue: 890000,
      churnRisk: 'low',
      segment: 'Enterprise',
      lastOrderDate: '2024-01-18',
    },
  ])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  const getChurnRiskColor = (risk: string) => {
    const colors: Record<string, string> = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800',
    }
    return colors[risk] || 'bg-gray-100 text-gray-800'
  }

  const columns = [
    { key: 'name', label: 'Customer Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'totalOrders', label: 'Total Orders' },
    { key: 'totalValue', label: 'Lifetime Value', render: (val: number) => `$${val.toLocaleString()}` },
    {
      key: 'churnRisk',
      label: 'Churn Risk',
      render: (val: string) => (
        <span className={`px-2 py-1 rounded text-sm font-medium ${getChurnRiskColor(val)}`}>
          {val}
        </span>
      ),
    },
    { key: 'segment', label: 'Segment' },
    { key: 'lastOrderDate', label: 'Last Order' },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <Button onClick={() => {}}>Add Customer</Button>
        </div>

        {/* Alert */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-red-900">High Churn Risk Customers</h3>
            <p className="text-sm text-red-700">3 customers identified with high churn risk. Consider reaching out.</p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Search Customers"
            type="text"
            placeholder="Name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-gray-900">
            <option>All Segments</option>
            <option>Enterprise</option>
            <option>SMB</option>
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
