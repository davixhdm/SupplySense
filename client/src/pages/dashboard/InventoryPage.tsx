import { useEffect, useState } from 'react'
import { DashboardLayout } from '../../layouts/DashboardLayout'
import { Widget } from '../../components/dashboard/Widget'
import { Table } from '../../components/common/Table'
import { Input } from '../../components/common/Input'
import { Button } from '../../components/common/Button'
import { AlertCircle } from 'lucide-react'

interface InventoryItem {
  id: string
  sku: string
  name: string
  currentStock: number
  reorderPoint: number
  supplier: string
  stockoutRisk: 'low' | 'medium' | 'high'
  lastRestocked: string
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: '1',
      sku: 'SKU-001',
      name: 'Premium Widget A',
      currentStock: 45,
      reorderPoint: 50,
      supplier: 'Global Parts Inc',
      stockoutRisk: 'high',
      lastRestocked: '2024-01-10',
    },
    {
      id: '2',
      sku: 'SKU-002',
      name: 'Standard Component B',
      currentStock: 230,
      reorderPoint: 100,
      supplier: 'Tech Supply Ltd',
      stockoutRisk: 'low',
      lastRestocked: '2024-01-12',
    },
    {
      id: '3',
      sku: 'SKU-003',
      name: 'Connector Pack C',
      currentStock: 78,
      reorderPoint: 80,
      supplier: 'Universal Supplies',
      stockoutRisk: 'medium',
      lastRestocked: '2024-01-08',
    },
  ])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  const getRiskColor = (risk: string) => {
    const colors: Record<string, string> = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800',
    }
    return colors[risk] || 'bg-gray-100 text-gray-800'
  }

  const getStockStatus = (current: number, reorder: number) => {
    if (current <= reorder) return 'bg-red-50 border-red-200'
    if (current <= reorder * 1.5) return 'bg-yellow-50 border-yellow-200'
    return 'bg-green-50 border-green-200'
  }

  const columns = [
    { key: 'sku', label: 'SKU' },
    { key: 'name', label: 'Product Name' },
    {
      key: 'currentStock',
      label: 'Current Stock',
      render: (val: number, item: InventoryItem) => (
        <div className={`px-3 py-1 rounded border ${getStockStatus(val, item.reorderPoint)}`}>
          {val}
        </div>
      ),
    },
    { key: 'reorderPoint', label: 'Reorder Point' },
    { key: 'supplier', label: 'Supplier' },
    {
      key: 'stockoutRisk',
      label: 'Stockout Risk',
      render: (val: string) => (
        <span className={`px-2 py-1 rounded text-sm font-medium ${getRiskColor(val)}`}>
          {val}
        </span>
      ),
    },
    { key: 'lastRestocked', label: 'Last Restocked' },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
          <Button onClick={() => {}}>Add Item</Button>
        </div>

        {/* Alerts */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-red-900">Low Stock Alerts</h3>
            <p className="text-sm text-red-700">3 items below reorder point. Reorder recommended.</p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Search Inventory"
            type="text"
            placeholder="SKU, product name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-gray-900">
            <option>All Risk Levels</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-gray-900">
            <option>All Suppliers</option>
            <option>Global Parts Inc</option>
            <option>Tech Supply Ltd</option>
            <option>Universal Supplies</option>
          </select>
        </div>

        {/* Inventory Table */}
        <Widget title="Inventory Items">
          <Table columns={columns} data={inventory} loading={loading} />
        </Widget>
      </div>
    </DashboardLayout>
  )
}
