import { useEffect, useState } from 'react'
import { DashboardLayout } from '../../../layouts/DashboardLayout'
import { Widget } from '../../../components/dashboard/Widget'
import { Button } from '../../../components/common/Button'
import { Input } from '../../../components/common/Input'
import { AlertBanner } from '../../../components/common/AlertBanner'
import { Users, Plus, Trash2, Mail, Shield, AlertCircle } from 'lucide-react'
import { userService } from '../../../services'
import { useApiPaginated, useApiMutation } from '../../../hooks'

interface User {
  id?: string
  _id?: string
  name: string
  email: string
  role?: 'admin' | 'manager' | 'user'
  status?: 'active' | 'inactive'
  createdAt?: string
  lastLogin?: string
}

export default function UsersPage() {
  const [showAddUser, setShowAddUser] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'user' as const })

  // Fetch users
  const {
    data: users,
    loading,
    error: usersError,
    refetch,
  } = useApiPaginated(userService.getUsers, 1, 50)

  // Mutation for creating user
  const { mutate: createUser, loading: createLoading } = useApiMutation(
    (data) => userService.createUser(data)
  )

  // Mutation for deleting user
  const { mutate: deleteUser } = useApiMutation(
    (id) => userService.deleteUser(id)
  )

  // Mutation for updating user
  const { mutate: updateUser } = useApiMutation(
    (data) => userService.updateUser(data.id, data)
  )

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newUser.name && newUser.email && newUser.role) {
      try {
        setError(null)
        await createUser({
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        })
        setNewUser({ name: '', email: '', role: 'user' })
        setShowAddUser(false)
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
        refetch()
      } catch (err) {
        setError('Failed to create user')
        console.error('Failed to create user:', err)
      }
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        setError(null)
        await deleteUser(userId)
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
        refetch()
      } catch (err) {
        setError('Failed to delete user')
        console.error('Failed to delete user:', err)
      }
    }
  }

  const handleChangeRole = async (userId: string, newRole: 'admin' | 'manager' | 'user') => {
    try {
      setError(null)
      await updateUser({
        id: userId,
        role: newRole,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      refetch()
    } catch (err) {
      setError('Failed to update user')
      console.error('Failed to update user:', err)
    }
  }

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    try {
      setError(null)
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
      await updateUser({
        id: userId,
        status: newStatus,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      refetch()
    } catch (err) {
      setError('Failed to update user status')
      console.error('Failed to update user status:', err)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
          <p className="text-gray-600 mt-1">Control user access and permissions for your team</p>
        </div>

        {saved && (
          <AlertBanner type="success" message="User settings updated successfully" />
        )}

        {(error || usersError) && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error || usersError}</p>
          </div>
        )}

        {/* Add User */}
        <Widget title="Add New User">
          {!showAddUser ? (
            <Button
              onClick={() => setShowAddUser(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Invite User
            </Button>
          ) : (
            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="John Doe"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="john@company.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  required
                />
                <select
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value as 'admin' | 'manager' | 'user' })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                >
                  <option value="user">User</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button type="submit" loading={createLoading}>
                  Send Invite
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowAddUser(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </Widget>

        {/* Users List */}
        <Widget title="Team Members" icon={<Users className="w-5 h-5" />}>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : users.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id || user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{user.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {user.email}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <select
                          value={user.role || 'user'}
                          onChange={(e) => handleChangeRole(user._id || user.id, e.target.value as 'admin' | 'manager' | 'user')}
                          className="px-2 py-1 border border-gray-300 rounded text-sm text-gray-900 bg-white"
                        >
                          <option value="user">User</option>
                          <option value="manager">Manager</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => handleToggleStatus(user._id || user.id, user.status || 'active')}
                          className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer ${
                            user.status === 'active'
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {user.status || 'active'}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-sm space-x-2 flex">
                        <button
                          onClick={() => handleDeleteUser(user._id || user.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 py-8 text-center">No users found</p>
          )}
        </Widget>

        {/* Role Descriptions */}
        <Widget title="User Roles & Permissions" icon={<Shield className="w-5 h-5" />}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Admin</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ Full system access</li>
                <li>✓ Manage users</li>
                <li>✓ Configure settings</li>
                <li>✓ View analytics</li>
              </ul>
            </div>

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
          <p className="text-gray-600 mt-1">Control user access and permissions for your team</p>
        </div>

        {saved && (
          <AlertBanner type="success" message="User settings updated successfully" />
        )}

        {/* Add User */}
        <Widget title="Add New User">
          {!showAddUser ? (
            <Button
              onClick={() => setShowAddUser(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Invite User
            </Button>
          ) : (
            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="John Doe"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="john@company.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
                <select
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value as 'admin' | 'manager' | 'user' })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                >
                  <option value="user">User</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Send Invite
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddUser(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-900 px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </Widget>

        {/* Users List */}
        <Widget title="Team Members" icon={<Users className="w-5 h-5" />}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Last Login</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{user.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {user.email}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <select
                        value={user.role}
                        onChange={(e) => handleChangeRole(user.id, e.target.value as 'admin' | 'manager' | 'user')}
                        className="px-2 py-1 border border-gray-300 rounded text-sm text-gray-900 bg-white"
                      >
                        <option value="user">User</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button
                        onClick={() => handleToggleStatus(user.id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer ${
                          user.status === 'active'
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {user.status}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{user.lastLogin}</td>
                    <td className="px-4 py-3 text-sm space-x-2 flex">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Widget>

        {/* Role Descriptions */}
        <Widget title="User Roles & Permissions" icon={<Shield className="w-5 h-5" />}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Admin</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ Full system access</li>
                <li>✓ Manage users</li>
                <li>✓ Configure settings</li>
                <li>✓ View analytics</li>
                <li>✓ Manage backups</li>
              </ul>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Manager</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ View all data</li>
                <li>✓ Manage inventory</li>
                <li>✓ Manage orders</li>
                <li>✗ Manage users</li>
                <li>✗ Access settings</li>
              </ul>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">User</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ View dashboard</li>
                <li>✓ Create orders</li>
                <li>✓ View assigned data</li>
                <li>✗ Manage users</li>
                <li>✗ Access settings</li>
              </ul>
            </div>
          </div>
        </Widget>
      </div>
    </DashboardLayout>
  )
}
