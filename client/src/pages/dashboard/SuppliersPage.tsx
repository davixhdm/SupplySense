import { useState } from 'react'
import { DashboardLayout } from '../../layouts/DashboardLayout'
import { Widget } from '../../components/dashboard/Widget'
import { Table } from '../../components/common/Table'
import { Input } from '../../components/common/Input'
import { Button } from '../../components/common/Button'
import { Star, AlertCircle, RefreshCw } from 'lucide-react'
import { supplierService } from '../../services'
import { useApiPaginated } from '../../hooks'

interface Supplier {
  id: string
  _id?: string
  name: string
  location: string
  reliabilityScore: number
  onTimeDeliveryRate: number
  totalOrders: number
  activeProducts?: number
  averageRating?: number
}

export default function SuppliersPage() {
  const [search, setSearch] = useState('')

  // Fetch suppliers using the hook
  const {
    data: suppliers,
    loading,
    error,
    page,
    nextPage,
    prevPage,
    refetch,
  } = useApiPaginated(supplierService.getSuppliers, 1, 20)

  const getReliabilityColor = (score: number) => {
    if (score >= 95) return 'bg-green-100 text-green-800'
    if (score >= 85) return 'bg-blue-100 text-blue-800'
    return 'bg-yellow-100 text-yellow-800'
  }

  const renderStars = (score: number) => {
    const rating = Math.min(5, score / 20) // Convert percentage to rating
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>
    )
  }

  const columns = [
    { key: 'name', label: 'Supplier Name' },
    { key: 'location', label: 'Location' },
    {
      key: 'reliabilityScore',
      label: 'Reliability',
      render: (val: number) => (
        <span className={`px-2 py-1 rounded text-sm font-medium ${getReliabilityColor(val)}`}>
          {val}%
        </span>
      ),
    },
    { 
      key: 'onTimeDeliveryRate', 
      label: 'On-Time Delivery', 
      render: (val: number) => `${val}%` 
    },
    { key: 'totalOrders', label: 'Total Orders' },
    {
      key: 'averageRating',
      label: 'Performance',
      render: (val: number) => renderStars(val || 0),
    },
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
          <h1 className="text-3xl font-bold text-gray-900">Suppliers</h1>
          <Button onClick={() => {}}>Add Supplier</Button>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <Input
            type="text"
            placeholder="Search suppliers by name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Suppliers Table */}
        <Widget title="Suppliers">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : suppliers.length > 0 ? (
            <>
              <Table columns={columns} data={suppliers} />
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Page {page} | Suppliers: {suppliers.length}
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
            <p className="text-gray-500 py-8 text-center">No suppliers found</p>
          )}
        </Widget>
      </div>
    </DashboardLayout>
  )
}
