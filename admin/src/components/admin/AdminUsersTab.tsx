import { useState, useEffect } from 'react'
import { adminSettingsService } from '../../services/adminSettingsService'
import Button from '../common/Button'
import Input from '../common/Input'
import Modal from '../common/Modal'
import toast from 'react-hot-toast'

export default function AdminUsersTab() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: 'moderator', phone: '' })
  const [creating, setCreating] = useState(false)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await adminSettingsService.getUsers()
      setUsers(Array.isArray(res) ? res : res.users || [])
    } catch (err) {
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  const handleCreate = async () => {
    if (!form.fullName || !form.email || !form.password) {
      toast.error('Name, email and password are required')
      return
    }
    setCreating(true)
    try {
      await adminSettingsService.createUser(form)
      toast.success('User created')
      setShowCreate(false)
      setForm({ fullName: '', email: '', password: '', role: 'moderator', phone: '' })
      fetchUsers()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create')
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await adminSettingsService.deleteUser(id)
      toast.success('User deactivated')
      fetchUsers()
    } catch (err) {
      toast.error('Failed to delete')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-700 dark:text-gray-200">Admin Users</h3>
        <Button size="sm" onClick={() => setShowCreate(true)}>Add User</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs">Name</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs">Email</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs">Role</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs">Status</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500 uppercase text-xs">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-4 py-3 font-medium">{user.fullName}</td>
                  <td className="px-4 py-3 text-gray-500">{user.email}</td>
                  <td className="px-4 py-3 text-xs capitalize">{user.role}</td>
                  <td className="px-4 py-3">
                    {user.isActive ? (
                      <span className="px-2 py-0.5 rounded text-xs bg-green-100 text-green-800">Active</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-xs bg-red-100 text-red-800">Inactive</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(user._id)}>Deactivate</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Admin User">
        <div className="space-y-3">
          <Input label="Full Name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm">
              <option value="moderator">Moderator</option>
              <option value="superadmin">Super Admin</option>
            </select>
          </div>
          <Button onClick={handleCreate} loading={creating} className="w-full">Create</Button>
        </div>
      </Modal>
    </div>
  )
}