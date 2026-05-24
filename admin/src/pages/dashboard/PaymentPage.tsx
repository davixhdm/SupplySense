import { useState, useEffect } from 'react'
import { paymentService } from '../../services/paymentService'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import { formatDate, formatCurrency } from '../../utils/helpers'
import { PAYMENT_METHODS, PLAN_LABELS, BILLING_LABELS } from '../../utils/constants'
import { Eye, Check, X, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function PaymentPage() {
  const [pending, setPending] = useState<any[]>([])
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'pending' | 'history'>('pending')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [viewItem, setViewItem] = useState<any>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [showReject, setShowReject] = useState<any>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [pendingRes, historyRes] = await Promise.all([
        paymentService.getPending(),
        paymentService.getHistory({ limit: '50' })
      ])
      setPending(pendingRes.activations || [])
      setHistory(historyRes.payments || [])
    } catch (err) {
      toast.error('Failed to load payments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleApprove = async (id: string) => {
    setActionLoading(id)
    try {
      await paymentService.approve(id)
      toast.success('Payment approved — license sent')
      fetchData()
    } catch (err) {
      toast.error('Failed to approve')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async () => {
    if (!showReject) return
    setActionLoading(showReject._id)
    try {
      await paymentService.reject(showReject._id, rejectReason || 'Rejected by admin')
      toast.success('Payment rejected')
      setShowReject(null)
      setRejectReason('')
      fetchData()
    } catch (err) {
      toast.error('Failed to reject')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (id: string) => {
    setActionLoading(id)
    try {
      await paymentService.removeHistory(id)
      toast.success('Removed from history')
      fetchData()
    } catch (err) {
      toast.error('Failed to delete')
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Payments</h1>

      <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700">
        <button onClick={() => setTab('pending')} className={`pb-3 text-sm font-medium border-b-2 transition-colors ${tab === 'pending' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500'}`}>Pending Approvals ({pending.length})</button>
        <button onClick={() => setTab('history')} className={`pb-3 text-sm font-medium border-b-2 transition-colors ${tab === 'history' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500'}`}>Payment History</button>
      </div>

      {tab === 'pending' ? (
        pending.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-white dark:bg-gray-800 rounded-xl border">No pending approvals</div>
        ) : (
          <div className="space-y-3">
            {pending.map((item) => (
              <div key={item._id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{item.fullName}</p>
                    <p className="text-sm text-gray-500">{item.userEmail} · {item.userPhone}</p>
                    <p className="text-xs text-gray-400 mt-1">{PLAN_LABELS[item.plan]} · {BILLING_LABELS[item.billingCycle]} · {formatCurrency(item.amount, item.currency)} · {PAYMENT_METHODS[item.paymentMethod]}</p>
                    <p className="text-xs text-gray-400">{formatDate(item.submittedAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setViewItem(item)}><Eye size={14} /></Button>
                    <Button variant="primary" size="sm" onClick={() => handleApprove(item._id)} loading={actionLoading === item._id}><Check size={14} className="mr-1" /> Approve</Button>
                    <Button variant="danger" size="sm" onClick={() => setShowReject(item)} loading={actionLoading === item._id}><X size={14} className="mr-1" /> Reject</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        history.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-white dark:bg-gray-800 rounded-xl border">No payment history</div>
        ) : (
          <div className="space-y-3">
            {history.map((payment) => (
              <div key={payment._id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{payment.organizationId?.organizationName || 'Unknown'}</p>
                    <p className="text-sm text-gray-500">{formatCurrency(payment.amount, payment.currency)} · {PAYMENT_METHODS[payment.paymentMethod]} · <span className={`font-medium ${payment.status === 'completed' ? 'text-green-600' : payment.status === 'refunded' ? 'text-red-600' : 'text-gray-500'}`}>{payment.status}</span></p>
                    <p className="text-xs text-gray-400">{formatDate(payment.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setViewItem(payment)}><Eye size={14} /></Button>
                    {(payment.status === 'completed' || payment.status === 'refunded') && (
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(payment._id)} loading={actionLoading === payment._id}><Trash2 size={14} className="text-red-500" /></Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      <Modal isOpen={!!viewItem} onClose={() => setViewItem(null)} title="Payment Details">
        {viewItem && (
          <div className="space-y-3 text-sm">
            <div><span className="text-gray-500">Name:</span> <span className="font-medium">{viewItem.fullName}</span></div>
            <div><span className="text-gray-500">Email:</span> <span className="font-medium">{viewItem.userEmail || viewItem.organizationId?.email}</span></div>
            <div><span className="text-gray-500">Phone:</span> <span className="font-medium">{viewItem.userPhone || viewItem.organizationId?.phone}</span></div>
            <div><span className="text-gray-500">Plan:</span> <span className="font-medium">{PLAN_LABELS[viewItem.plan]}</span></div>
            <div><span className="text-gray-500">Billing:</span> <span className="font-medium">{BILLING_LABELS[viewItem.billingCycle]}</span></div>
            <div><span className="text-gray-500">Amount:</span> <span className="font-medium">{formatCurrency(viewItem.amount, viewItem.currency)}</span></div>
            <div><span className="text-gray-500">Method:</span> <span className="font-medium">{PAYMENT_METHODS[viewItem.paymentMethod]}</span></div>
            <div><span className="text-gray-500">Status:</span> <span className="font-medium capitalize">{viewItem.status}</span></div>
            <div><span className="text-gray-500">Date:</span> <span className="font-medium">{formatDate(viewItem.submittedAt || viewItem.createdAt)}</span></div>
            {viewItem.paymentDetails && (
              <div><span className="text-gray-500">Payment Details:</span> <pre className="text-xs mt-1 bg-gray-50 dark:bg-gray-900 p-2 rounded">{JSON.stringify(viewItem.paymentDetails, null, 2)}</pre></div>
            )}
          </div>
        )}
      </Modal>

      <Modal isOpen={!!showReject} onClose={() => setShowReject(null)} title="Reject Payment">
        <div className="space-y-3">
          <p className="text-sm text-gray-500">Reject payment from <strong>{showReject?.fullName}</strong></p>
          <Input label="Reason (optional)" value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Enter rejection reason..." />
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setShowReject(null)} className="flex-1">Cancel</Button>
            <Button variant="danger" onClick={handleReject} loading={actionLoading === showReject?._id} className="flex-1">Confirm Reject</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}