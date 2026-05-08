import { useState, useEffect } from 'react'
import { paymentService } from '../../services/paymentService'
import PendingActivationRow from '../../components/admin/PendingActivationRow'
import { formatCurrency } from '../../utils/helpers'
import { PAYMENT_METHODS } from '../../utils/constants'
import toast from 'react-hot-toast'
import Button from '../../components/common/Button'

export default function PaymentPage() {
  const [pending, setPending] = useState<any[]>([])
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'pending' | 'history'>('pending')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [pendingRes, historyRes] = await Promise.all([
        paymentService.getPending(),
        paymentService.getHistory({ limit: '20' })
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
    setActionLoading(id + 'approve')
    try {
      await paymentService.approve(id)
      toast.success('Payment approved')
      fetchData()
    } catch (err) {
      toast.error('Failed to approve')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (id: string) => {
    setActionLoading(id + 'reject')
    try {
      await paymentService.reject(id, 'Rejected by admin')
      toast.success('Payment rejected')
      fetchData()
    } catch (err) {
      toast.error('Failed to reject')
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Payments</h1>

      <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setTab('pending')}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${tab === 'pending' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Pending Approvals
        </button>
        <button
          onClick={() => setTab('history')}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${tab === 'history' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Payment History
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>
      ) : tab === 'pending' ? (
        <div className="space-y-4">
          {pending.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No pending approvals</p>
          ) : (
            pending.map((item) => (
              <PendingActivationRow
                key={item._id}
                activation={item}
                onApprove={handleApprove}
                onReject={handleReject}
                loading={actionLoading}
              />
            ))
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs">Organization</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs">Amount</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs">Method</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {history.map((payment) => (
                <tr key={payment._id}>
                  <td className="px-4 py-3">{payment.organizationId?.organizationName || '—'}</td>
                  <td className="px-4 py-3 font-medium">{formatCurrency(payment.amount, payment.currency)}</td>
                  <td className="px-4 py-3 text-xs">{PAYMENT_METHODS[payment.paymentMethod] || payment.paymentMethod}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${payment.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{new Date(payment.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}