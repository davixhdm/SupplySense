import { useState, useEffect } from 'react'
import { customerService } from '../../services/customerService'
import Table from '../../components/common/Table'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import { formatCurrency } from '../../utils/helpers'
import { Plus } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CustomersPage() {
  const [data, setData] = useState<any>({ customers: [] })
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', customerType: 'individual' })
  const [creating, setCreating] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try { const res = await customerService.getAll({ page }); setData(res) }
    catch (err) { toast.error('Failed') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [page])

  const handleCreate = async () => {
    if (!form.fullName) { toast.error('Name required'); return }
    setCreating(true)
    try { await customerService.create(form); toast.success('Customer created'); setShowCreate(false); fetchData() }
    catch (err) { toast.error('Failed') }
    finally { setCreating(false) }
  }

  const columns = [
    { key: 'fullName', header: 'Name', render: (c: any) => <span className="font-medium">{c.fullName}</span> },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { key: 'totalSpent', header: 'Total Spent', render: (c: any) => formatCurrency(c.totalSpent) },
    { key: 'purchaseCount', header: 'Purchases' },
    { key: 'churnRisk', header: 'Churn Risk', render: (c: any) => (
      <span className={`font-medium ${c.churnRisk >= 60 ? 'text-red-600' : c.churnRisk >= 30 ? 'text-yellow-600' : 'text-green-600'}`}>{c.churnRisk}%</span>
    )}
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Customers</h1>
        <Button onClick={() => setShowCreate(true)}><Plus size={16} className="mr-1" /> Add Customer</Button>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <Table columns={columns} data={data.customers || []} loading={loading} />
      </div>
      {data.pagination && data.pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: data.pagination.pages }, (_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} className={`px-3 py-1 rounded text-sm ${page === i + 1 ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}>{i + 1}</button>
          ))}
        </div>
      )}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Add Customer">
        <div className="space-y-3">
          <Input label="Full Name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select value={form.customerType} onChange={(e) => setForm({ ...form, customerType: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-800">
              <option value="individual">Individual</option>
              <option value="business">Business</option>
              <option value="wholesale">Wholesale</option>
              <option value="vip">VIP</option>
            </select>
          </div>
          <Button onClick={handleCreate} loading={creating} className="w-full">Create</Button>
        </div>
      </Modal>
    </div>
  )
}