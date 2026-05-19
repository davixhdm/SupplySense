import { useState } from 'react'
import { DashboardLayout } from '../../layouts/DashboardLayout'
import { Widget } from '../../components/dashboard/Widget'
import { Table } from '../../components/common/Table'
import { Input } from '../../components/common/Input'
import { Button } from '../../components/common/Button'
import { Mail, Phone, AlertCircle, RefreshCw } from 'lucide-react'
import { employeeService } from '../../services'
import { useApiPaginated } from '../../hooks'

interface Employee {
  id: string
  _id?: string
  name: string
  email: string
  department: string
  position: string
  hireDate?: string
  joinDate?: string
  status?: 'active' | 'on-leave' | 'inactive'
  phone?: string
}

export default function EmployeesPage() {
  const [search, setSearch] = useState('')

  // Fetch employees using the hook
  const {
    data: employees,
    loading,
    error,
    page,
    nextPage,
    prevPage,
    refetch,
  } = useApiPaginated(employeeService.getEmployees, 1, 20)

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      'on-leave': 'bg-yellow-100 text-yellow-800',
      inactive: 'bg-gray-100 text-gray-800',
    }
    return colors[status] || 'bg-blue-100 text-blue-800'
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
      render: (val: string) => 
        val ? (
          <a href={`tel:${val}`} className="text-blue-600 hover:underline flex items-center gap-1">
            <Phone className="w-4 h-4" />
            {val}
          </a>
        ) : '-',
    },
    {
      key: 'status',
      label: 'Status',
      render: (val: string) => (
        <span className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(val || 'active')}`}>
          {val || 'active'}
        </span>
      ),
    },
  ]

  const activeCount = employees.filter((e) => e.status === 'active').length
  const onLeaveCount = employees.filter((e) => e.status === 'on-leave').length

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
          <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
          <Button onClick={() => {}}>Add Employee</Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <Input
            type="text"
            placeholder="Search employees by name, email, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Employees Table */}
        <Widget title="Team Members">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : employees.length > 0 ? (
            <>
              <Table columns={columns} data={employees} />
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Page {page} | Employees: {employees.length}
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
            <p className="text-gray-500 py-8 text-center">No employees found</p>
          )}
        </Widget>
      </div>
    </DashboardLayout>
  )
}
