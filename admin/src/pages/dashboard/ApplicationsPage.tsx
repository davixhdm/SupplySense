import { useState, useEffect } from 'react'
import { applicationsService } from '../../services/applicationsService'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import { formatDate } from '../../utils/helpers'
import { PLAN_LABELS, BILLING_LABELS } from '../../utils/constants'
import { Search, Eye, Ban, RotateCcw, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ApplicationsPage() {
  const [apps, setApps] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [viewApp, setViewApp] = useState<any>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)

  const fetchApps = async () => {
    setLoading(true)
    try {
      const res = await applicationsService.getAll({ search: search || undefined })
      setApps(res.applications || [])
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
    try { await applicationsService.suspend(id, 'Admin action'); toast.success('Organization suspended'); fetchApps() }
    catch (err) { toast.error('Failed to suspend') }
    finally { setActionLoading(false) }
  }

  const handleReactivate = async (id: string) => {
    setActionLoading(true)
    try { await applicationsService.reactivate(id); toast.success('Organization reactivated'); fetchApps() }
    catch (err) { toast.error('Failed to reactivate') }
    finally { setActionLoading(false) }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}" and ALL associated data permanently? This cannot be undone.`)) return
    setDeleteLoading(id)
    try { await applicationsService.deleteOrg(id); toast.success('Organization deleted'); fetchApps() }
    catch (err) { toast.error('Failed to delete') }
    finally { setDeleteLoading(null) }
  }

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Applications</h1>

      <div className="flex gap-2 mb-6">
        <Input placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
        <Button onClick={handleSearch}><Search size={16} /></Button>
      </div>

      {apps.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white dark:bg-gray-800 rounded-xl border">No organizations found</div>
      ) : (
        <div className="space-y-3">
          {apps.map((app) => (
            <div key={app._id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{app.organizationName}</p>
                  <p className="text-sm text-gray-500">{app.email} · {app.phone || 'No phone'}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary-50 text-primary-700">{PLAN_LABELS[app.plan]}</span>
                    <span className="text-xs text-gray-400">{BILLING_LABELS[app.billingCycle]}</span>
                    {app.isSuspended ? (
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">Suspended</span>
                    ) : app.isActive ? (
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Active</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">Inactive</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Created: {formatDate(app.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setViewApp(app)}><Eye size={14} /></Button>
                  {app.isSuspended ? (
                    <Button variant="primary" size="sm" onClick={() => handleReactivate(app._id)} loading={actionLoading}><RotateCcw size={14} className="mr-1" /> Reactivate</Button>
                  ) : (
                    <Button variant="danger" size="sm" onClick={() => handleSuspend(app._id)} loading={actionLoading}><Ban size={14} className="mr-1" /> Suspend</Button>
                  )}
                  <button onClick={() => handleDelete(app._id, app.organizationName)} disabled={deleteLoading === app._id} className="p-1.5 rounded hover:bg-red-50 text-red-500" title="Delete permanently">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={!!viewApp} onClose={() => setViewApp(null)} title="Organization Details" size="lg">
        {viewApp && (
          <div className="space-y-3 text-sm max-h-96 overflow-y-auto">
            <div className="grid grid-cols-2 gap-3">
              <div><span className="text-gray-500">Name:</span> <p className="font-medium">{viewApp.organizationName}</p></div>
              <div><span className="text-gray-500">Slug:</span> <p className="font-medium">{viewApp.slug}</p></div>
              <div><span className="text-gray-500">Email:</span> <p className="font-medium">{viewApp.email}</p></div>
              <div><span className="text-gray-500">Phone:</span> <p className="font-medium">{viewApp.phone || 'N/A'}</p></div>
              <div><span className="text-gray-500">Industry:</span> <p className="font-medium capitalize">{viewApp.industry}</p></div>
              <div><span className="text-gray-500">Plan:</span> <p className="font-medium">{PLAN_LABELS[viewApp.plan]}</p></div>
              <div><span className="text-gray-500">Billing:</span> <p className="font-medium">{BILLING_LABELS[viewApp.billingCycle]}</p></div>
              <div><span className="text-gray-500">Status:</span> <p className="font-medium">{viewApp.isSuspended ? 'Suspended' : viewApp.isActive ? 'Active' : 'Inactive'}</p></div>
              <div><span className="text-gray-500">Users:</span> <p className="font-medium">{viewApp.maxUsers}</p></div>
              <div><span className="text-gray-500">Created:</span> <p className="font-medium">{formatDate(viewApp.createdAt)}</p></div>
            </div>
            {viewApp.licenseKey && (
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <span className="text-gray-500">License Key:</span>
                <p className="font-mono font-bold text-primary-600 mt-1">{viewApp.licenseKey}</p>
              </div>
            )}
            {viewApp.address && (viewApp.address.city || viewApp.address.country) && (
              <div><span className="text-gray-500">Address:</span> <p className="font-medium">{[viewApp.address.street, viewApp.address.city, viewApp.address.state, viewApp.address.country].filter(Boolean).join(', ') || 'N/A'}</p></div>
            )}
            {viewApp.erpConnections?.length > 0 && (
              <div>
                <span className="text-gray-500">ERP Connections:</span>
                <div className="space-y-1 mt-1">
                  {viewApp.erpConnections.map((erp: any, i: number) => (
                    <p key={i} className="text-xs">{erp.name} ({erp.type}) — {erp.isActive ? 'Active' : 'Inactive'}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}