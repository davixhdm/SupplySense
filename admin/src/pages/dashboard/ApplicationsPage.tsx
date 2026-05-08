import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { applicationsService } from '../../services/applicationsService'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import { formatDate } from '../../utils/helpers'
import { PLAN_LABELS } from '../../utils/constants'
import toast from 'react-hot-toast'

export default function ApplicationsPage() {
  const [apps, setApps] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedApp, setSelectedApp] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const fetchApps = async () => {
    setLoading(true)
    try {
      const res = await applicationsService.getAll({ search: search || undefined })
      setApps(res.applications)
    } catch (err) {
      toast.error('Failed to load applications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchApps() }, [])

  const handleSearch = () => fetchApps()

  const handleSuspend = async (id: string) => {
    setActionLoading(true)
    try {
      await applicationsService.suspend(id, 'Admin action')
      toast.success('Organization suspended')
      fetchApps()
    } catch (err) {
      toast.error('Failed to suspend')
    } finally {
      setActionLoading(false)
      setShowModal(false)
    }
  }

  const handleReactivate = async (id: string) => {
    setActionLoading(true)
    try {
      await applicationsService.reactivate(id)
      toast.success('Organization reactivated')
      fetchApps()
    } catch (err) {
      toast.error('Failed to reactivate')
    } finally {
      setActionLoading(false)
      setShowModal(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Applications</h1>

      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch}><Search size={16} /></Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs">Organization</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs">Plan</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs">Created</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500 uppercase text-xs">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {apps.map((app) => (
                <tr key={app._id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="px-4 py-3">
                    <p className="font-medium">{app.organizationName}</p>
                    <p className="text-xs text-gray-400">{app.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary-50 text-primary-700">{PLAN_LABELS[app.plan]}</span>
                  </td>
                  <td className="px-4 py-3">
                    {app.isSuspended ? (
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">Suspended</span>
                    ) : app.isActive ? (
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Active</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">Inactive</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(app.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { setSelectedApp(app); setShowModal(true) }}
                    >
                      Manage
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Manage Application">
        {selectedApp && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Organization</p>
              <p className="font-medium">{selectedApp.organizationName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{selectedApp.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Plan</p>
              <p className="font-medium">{PLAN_LABELS[selectedApp.plan]}</p>
            </div>
            <div className="flex gap-2 pt-2">
              {selectedApp.isSuspended ? (
                <Button variant="primary" size="sm" onClick={() => handleReactivate(selectedApp._id)} loading={actionLoading}>
                  Reactivate
                </Button>
              ) : (
                <Button variant="danger" size="sm" onClick={() => handleSuspend(selectedApp._id)} loading={actionLoading}>
                  Suspend
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}