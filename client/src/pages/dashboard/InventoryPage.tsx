import { useEffect, useState } from 'react'
import { DashboardLayout } from '../../layouts/DashboardLayout'
import { Widget } from '../../components/dashboard/Widget'
import { Table } from '../../components/common/Table'
import { Input } from '../../components/common/Input'
import { Button } from '../../components/common/Button'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { inventoryService } from '../../services'
import { useApiPaginated } from '../../hooks'

interface InventoryItem {
  id: string
  _id?: string
  sku: string
  name: string
  currentStock: number
  reorderPoint: number
  supplier: string
  stockoutRisk: 'low' | 'medium' | 'high'
  lastRestocked: string
}

export default function InventoryPage() {
  const [search, setSearch] = useState('')

  // Fetch inventory using the hook
  const {
    data: inventoryItems,
    loading,
    error,
    page,
    limit,
    nextPage,
    prevPage,
    refetch,
  } = useApiPaginated(inventoryService.getInventory, 1, 20)

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
      key: 'quantity',
      label: 'Current Stock',
      render: (val: number, item: any) => (
        <div className={`px-3 py-1 rounded border ${getStockStatus(val, item.reorderLevel)}`}>
          {val}
        </div>
      ),
    },
    { key: 'reorderLevel', label: 'Reorder Point' },
    { key: 'supplier', label: 'Supplier' },
    { key: 'category', label: 'Category' },
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
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <Button variant="primary">Add Product</Button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <Input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Inventory Table */}
        <Widget title="Products">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : inventoryItems.length > 0 ? (
            <>
              <Table data={inventoryItems} columns={columns} />
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Page {page} | Items: {inventoryItems.length}
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
            <p className="text-gray-500 py-8 text-center">No products found</p>
          )}
        </Widget>
      </div>
    </DashboardLayout>
  )
}
