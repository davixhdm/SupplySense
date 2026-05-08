import { useEffect, useState } from 'react'
import { DashboardLayout } from '../../layouts/DashboardLayout'
import { Widget } from '../../components/dashboard/Widget'
import { Table } from '../../components/common/Table'
import { Input } from '../../components/common/Input'
import { Button } from '../../components/common/Button'
import { Download } from 'lucide-react'

interface Transaction {
  id: string
  date: string
  description: string
  category: string
  amount: number
  type: 'income' | 'expense'
  status: 'completed' | 'pending' | 'failed'
  reference: string
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      date: '2024-01-18',
      description: 'Order Payment - ORD-001',
      category: 'Sales',
      amount: 2500,
      type: 'income',
      status: 'completed',
      reference: 'TXN-001',
    },
    {
      id: '2',
      date: '2024-01-17',
      description: 'Supplier Invoice - Global Parts Inc',
      category: 'Purchases',
      amount: 5300,
      type: 'expense',
      status: 'completed',
      reference: 'TXN-002',
    },
    {
      id: '3',
      date: '2024-01-16',
      description: 'Payroll - January',
      category: 'Salaries',
      amount: 45000,
      type: 'expense',
      status: 'pending',
      reference: 'TXN-003',
    },
    {
      id: '4',
      date: '2024-01-15',
      description: 'Bank Transfer - Shipping',
      category: 'Logistics',
      amount: 1200,
      type: 'expense',
      status: 'completed',
      reference: 'TXN-004',
    },
  ])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

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
    { key: 'category', label: 'Category' },
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
        <span className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(val)}`}>
          {val}
        </span>
      ),
    },
    { key: 'reference', label: 'Reference' },
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

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            label="Search Transactions"
            type="text"
            placeholder="Description, reference..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-gray-900">
            <option>All Categories</option>
            <option>Sales</option>
            <option>Purchases</option>
            <option>Salaries</option>
            <option>Logistics</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-gray-900">
            <option>All Types</option>
            <option>Income</option>
            <option>Expense</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-gray-900">
            <option>All Statuses</option>
            <option>Completed</option>
            <option>Pending</option>
            <option>Failed</option>
          </select>
        </div>

        {/* Transactions Table */}
        <Widget title="Transaction History">
          <Table columns={columns} data={transactions} loading={loading} />
        </Widget>
      </div>
    </DashboardLayout>
  )
}
