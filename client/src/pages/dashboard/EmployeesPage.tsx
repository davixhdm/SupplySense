import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { employeeService } from '../../services/employeeService'
import Table from '../../components/common/Table'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import { DEPARTMENT_OPTIONS } from '../../utils/constants'
import { Plus, Lock } from 'lucide-react'
import toast from 'react-hot-toast'

export default function EmployeesPage() {
  const [data, setData] = useState<any>({ employees: [], blocked: false })
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', department: 'other', position: '', employeeId: '' })
  const [creating, setCreating] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await employeeService.getAll({ page })
      setData({ employees: res.employees || [], blocked: false, pagination: res.pagination })
    } catch (err: any) {
      if (err?.response?.status === 403) {
        setData({ employees: [], blocked: true })
      } else {
        toast.error('Failed to load')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [page])

  const handleCreate = async () => {
    if (!form.fullName || !form.email) { toast.error('Name and email required'); return }
    setCreating(true)
    try { await employeeService.create(form); toast.success('Employee created'); setShowCreate(false); fetchData() }
    catch (err: any) { toast.error(err?.response?.data?.message || 'Failed') }
    finally { setCreating(false) }
  }

  if (data.blocked) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Employees</h1>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <Lock size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">Feature Locked</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Upgrade to Standard or Pro+ to access employee management.</p>
          <Link to="/pricing"><Button variant="primary" size="sm" className="mt-4">Upgrade Plan</Button></Link>
        </div>
      </div>
    )
  }

  const columns = [
    { key: 'fullName', header: 'Name', render: (e: any) => <span className="font-medium">{e.fullName}</span> },
    { key: 'email', header: 'Email' },
    { key: 'department', header: 'Department', render: (e: any) => <span className="capitalize">{e.department}</span> },
    { key: 'position', header: 'Position' },
    { key: 'performanceScore', header: 'Performance', render: (e: any) => (
      <span className={`font-medium ${e.performanceScore >= 70 ? 'text-green-600' : e.performanceScore >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>{e.performanceScore}%</span>
    )}
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Employees</h1>
        <Button onClick={() => setShowCreate(true)}><Plus size={16} className="mr-1" /> Add Employee</Button>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <Table columns={columns} data={data.employees || []} loading={loading} />
      </div>
      {data.pagination && data.pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: data.pagination.pages }, (_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} className={`px-3 py-1 rounded text-sm ${page === i + 1 ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}>{i + 1}</button>
          ))}
        </div>
      )}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Add Employee">
        <div className="space-y-3">
          <Input label="Full Name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <div>
            <label className="block text-sm font-medium mb-1">Department</label>
            <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-800">
              {DEPARTMENT_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <Input label="Position" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
          <Input label="Employee ID" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} />
          <Button onClick={handleCreate} loading={creating} className="w-full">Create</Button>
        </div>
      </Modal>
    </div>
  )
}