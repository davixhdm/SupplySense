import { useEffect, useState } from 'react'
import { DashboardLayout } from '../../layouts/DashboardLayout'
import { Widget } from '../../components/dashboard/Widget'
import { Table } from '../../components/common/Table'
import { Input } from '../../components/common/Input'
import { Button } from '../../components/common/Button'
import { Mail, Phone } from 'lucide-react'

interface Employee {
  id: string
  name: string
  email: string
  department: string
  position: string
  joinDate: string
  status: 'active' | 'on-leave' | 'inactive'
  phone: string
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@supplysense.com',
      department: 'Operations',
      position: 'Operations Manager',
      joinDate: '2022-03-15',
      status: 'active',
      phone: '+1-555-0101',
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@supplysense.com',
      department: 'Supply Chain',
      position: 'Logistics Specialist',
      joinDate: '2023-01-10',
      status: 'active',
      phone: '+1-555-0102',
    },
    {
      id: '3',
      name: 'Michael Chen',
      email: 'michael.chen@supplysense.com',
      department: 'Inventory',
      position: 'Inventory Controller',
      joinDate: '2023-06-20',
      status: 'on-leave',
      phone: '+1-555-0103',
    },
    {
      id: '4',
      name: 'Emma Rodriguez',
      email: 'emma.rodriguez@supplysense.com',
      department: 'Finance',
      position: 'Financial Analyst',
      joinDate: '2021-11-05',
      status: 'active',
      phone: '+1-555-0104',
    },
  ])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      'on-leave': 'bg-yellow-100 text-yellow-800',
      inactive: 'bg-gray-100 text-gray-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const columns = [
    { key: 'name', label: 'Name' },
    {
      key: 'email',
      label: 'Email',
      render: (val: string) => (
        <a href={`mailto:${val}`} className="text-blue-600 hover:underline flex items-center gap-1">
          <Mail className="w-4 h-4" />
          {val}
        </a>
      ),
    },
    { key: 'department', label: 'Department' },
    { key: 'position', label: 'Position' },
    {
      key: 'phone',
      label: 'Phone',
      render: (val: string) => (
        <a href={`tel:${val}`} className="text-blue-600 hover:underline flex items-center gap-1">
          <Phone className="w-4 h-4" />
          {val}
        </a>
      ),
    },
    { key: 'joinDate', label: 'Join Date' },
    {
      key: 'status',
      label: 'Status',
      render: (val: string) => (
        <span className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(val)}`}>
          {val}
        </span>
      ),
    },
  ]

  const activeCount = employees.filter((e) => e.status === 'active').length
  const onLeaveCount = employees.filter((e) => e.status === 'on-leave').length

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
          <Button onClick={() => {}}>Add Employee</Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Widget title="Total Employees">
            <p className="text-4xl font-bold text-gray-900">{employees.length}</p>
            <p className="text-sm text-gray-600 mt-2">Team members</p>
          </Widget>
          <Widget title="Active">
            <p className="text-4xl font-bold text-green-600">{activeCount}</p>
            <p className="text-sm text-gray-600 mt-2">Working now</p>
          </Widget>
          <Widget title="On Leave">
            <p className="text-4xl font-bold text-yellow-600">{onLeaveCount}</p>
            <p className="text-sm text-gray-600 mt-2">Currently away</p>
          </Widget>
          <Widget title="Departments">
            <p className="text-4xl font-bold text-blue-600">4</p>
            <p className="text-sm text-gray-600 mt-2">Across company</p>
          </Widget>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Search Employees"
            type="text"
            placeholder="Name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-gray-900">
            <option>All Departments</option>
            <option>Operations</option>
            <option>Supply Chain</option>
            <option>Inventory</option>
            <option>Finance</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-gray-900">
            <option>All Statuses</option>
            <option>Active</option>
            <option>On Leave</option>
            <option>Inactive</option>
          </select>
        </div>

        {/* Employees Table */}
        <Widget title="Team Members">
          <Table columns={columns} data={employees} loading={loading} />
        </Widget>
      </div>
    </DashboardLayout>
  )
}
