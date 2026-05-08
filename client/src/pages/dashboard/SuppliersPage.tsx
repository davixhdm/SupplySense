import { useEffect, useState } from 'react'
import { DashboardLayout } from '../../layouts/DashboardLayout'
import { Widget } from '../../components/dashboard/Widget'
import { Table } from '../../components/common/Table'
import { Input } from '../../components/common/Input'
import { Button } from '../../components/common/Button'
import { Star, TrendingUp } from 'lucide-react'

interface Supplier {
  id: string
  name: string
  location: string
  reliability: number
  onTimeDelivery: number
  totalOrders: number
  activeProducts: number
  performanceScore: number
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: '1',
      name: 'Global Parts Inc',
      location: 'China',
      reliability: 94,
      onTimeDelivery: 91,
      totalOrders: 156,
      activeProducts: 24,
      performanceScore: 4.8,
    },
    {
      id: '2',
      name: 'Tech Supply Ltd',
      location: 'USA',
      reliability: 97,
      onTimeDelivery: 96,
      totalOrders: 203,
      activeProducts: 45,
      performanceScore: 4.9,
    },
    {
      id: '3',
      name: 'Universal Supplies',
      location: 'Germany',
      reliability: 88,
      onTimeDelivery: 85,
      totalOrders: 89,
      activeProducts: 18,
      performanceScore: 4.4,
    },
  ])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  const getReliabilityColor = (score: number) => {
    if (score >= 95) return 'bg-green-100 text-green-800'
    if (score >= 85) return 'bg-blue-100 text-blue-800'
    return 'bg-yellow-100 text-yellow-800'
  }

  const renderStars = (score: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < Math.floor(score) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">{score}</span>
      </div>
    )
  }

  const columns = [
    { key: 'name', label: 'Supplier Name' },
    { key: 'location', label: 'Location' },
    {
      key: 'reliability',
      label: 'Reliability',
      render: (val: number) => (
        <span className={`px-2 py-1 rounded text-sm font-medium ${getReliabilityColor(val)}`}>
          {val}%
        </span>
      ),
    },
    { key: 'onTimeDelivery', label: 'On-Time Delivery', render: (val: number) => `${val}%` },
    { key: 'totalOrders', label: 'Total Orders' },
    { key: 'activeProducts', label: 'Active Products' },
    {
      key: 'performanceScore',
      label: 'Performance',
      render: (val: number) => renderStars(val),
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Suppliers</h1>
          <Button onClick={() => {}}>Add Supplier</Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Search Suppliers"
            type="text"
            placeholder="Supplier name, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-gray-900">
            <option>All Locations</option>
            <option>USA</option>
            <option>China</option>
            <option>Germany</option>
            <option>India</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-gray-900">
            <option>Sort by</option>
            <option>Performance Score</option>
            <option>Reliability</option>
            <option>Total Orders</option>
          </select>
        </div>

        {/* Suppliers Table */}
        <Widget title="Suppliers">
          <Table columns={columns} data={suppliers} loading={loading} />
        </Widget>

        {/* Performance Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Widget title="Top Performer">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">Tech Supply Ltd</p>
              <div className="mt-3 flex justify-center">
                {renderStars(4.9)}
              </div>
              <p className="mt-2 text-sm text-gray-600">97% reliability score</p>
            </div>
          </Widget>
          <Widget title="Total Active Suppliers">
            <p className="text-4xl font-bold text-gray-900 text-center">12</p>
            <p className="text-center text-sm text-gray-600 mt-2">Across 8 countries</p>
          </Widget>
          <Widget title="Avg Performance Score">
            <p className="text-4xl font-bold text-blue-600 text-center">4.7</p>
            <p className="text-center text-sm text-gray-600 mt-2">Out of 5.0</p>
          </Widget>
        </div>
      </div>
    </DashboardLayout>
  )
}
