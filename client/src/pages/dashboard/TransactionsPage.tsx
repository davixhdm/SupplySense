import { useState } from 'react'
import { DashboardLayout } from '../../layouts/DashboardLayout'
import { Widget } from '../../components/dashboard/Widget'
import { Table } from '../../components/common/Table'
import { Input } from '../../components/common/Input'
import { Button } from '../../components/common/Button'
import { Download, AlertCircle, RefreshCw } from 'lucide-react'
import { transactionService } from '../../services'
import { useApiPaginated } from '../../hooks'

interface Transaction {
  id: string
  _id?: string
  date: string
  description: string
  category?: string
  amount: number
  type: 'income' | 'expense'
  status?: 'completed' | 'pending' | 'failed'
  reference?: string
}

export default function TransactionsPage() {
  const [search, setSearch] = useState('')

  // Fetch transactions using the hook
  const {
    data: transactions,
    loading,
    error,
    page,
    nextPage,
    prevPage,
    refetch,
  } = useApiPaginated(transactionService.getTransactions, 1, 20)

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getTypeColor = (type: string) => {
    return type === 'income' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'
  }

  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'description', label: 'Description' },
    {
      key: 'category',
      label: 'Category',
      render: (val: string) => val || '-',
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (val: number, item: Transaction) => (
        <span className={getTypeColor(item.type)}>
          {item.type === 'income' ? '+' : '-'}${val.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (val: string) => (
        <span className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(val || 'completed')}`}>
          {val || 'completed'}
        </span>
      ),
    },
  ]

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const netProfit = totalIncome - totalExpense

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
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <Button onClick={() => {}} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Widget title="Total Income">
            <p className="text-4xl font-bold text-green-600">${totalIncome.toLocaleString()}</p>
            <p className="text-sm text-gray-600 mt-2">From sales & orders</p>
          </Widget>
          <Widget title="Total Expenses">
            <p className="text-4xl font-bold text-red-600">${totalExpense.toLocaleString()}</p>
            <p className="text-sm text-gray-600 mt-2">Purchases & operations</p>
          </Widget>
          <Widget title="Net Profit">
            <p className={`text-4xl font-bold ${netProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              ${netProfit.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 mt-2">This period</p>
          </Widget>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <Input
            type="text"
            placeholder="Search transactions by description or reference..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Transactions Table */}
        <Widget title="Transaction History">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : transactions.length > 0 ? (
            <>
              <Table columns={columns} data={transactions} />
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Page {page} | Transactions: {transactions.length}
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
            <p className="text-gray-500 py-8 text-center">No transactions found</p>
          )}
        </Widget>
      </div>
    </DashboardLayout>
  )
}
