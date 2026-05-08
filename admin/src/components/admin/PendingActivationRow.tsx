import { formatDate, formatCurrency } from '../../utils/helpers'
import { PAYMENT_METHODS, PAYMENT_STATUS_COLORS, PLAN_LABELS, BILLING_LABELS } from '../../utils/constants'
import Button from '../common/Button'

interface PendingActivationRowProps {
  activation: any
  onApprove: (id: string) => void
  onReject: (id: string) => void
  loading?: string | null
}

export default function PendingActivationRow({ activation, onApprove, onReject, loading }: PendingActivationRowProps) {
  const isExpired = new Date(activation.expiresAt) < new Date()

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-xs text-gray-500">User</p>
          <p className="font-medium text-sm">{activation.fullName}</p>
          <p className="text-xs text-gray-400">{activation.userEmail}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Plan</p>
          <p className="font-medium text-sm">{PLAN_LABELS[activation.plan]}</p>
          <p className="text-xs text-gray-400">{BILLING_LABELS[activation.billingCycle]}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Payment</p>
          <p className="font-medium text-sm">{formatCurrency(activation.amount, activation.currency)}</p>
          <p className="text-xs text-gray-400">{PAYMENT_METHODS[activation.paymentMethod] || activation.paymentMethod}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Status</p>
          <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${PAYMENT_STATUS_COLORS[activation.status]}`}>
            {activation.paymentConfirmed ? 'Payment Confirmed' : 'Awaiting Verification'}
          </span>
          {isExpired && <span className="ml-1 px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">Expired</span>}
        </div>
      </div>

      {activation.status === 'pending' && !isExpired && (
        <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 justify-end">
          <Button variant="danger" size="sm" onClick={() => onReject(activation._id)} loading={loading === activation._id + 'reject'}>
            Reject
          </Button>
          <Button variant="primary" size="sm" onClick={() => onApprove(activation._id)} loading={loading === activation._id + 'approve'}>
            Approve
          </Button>
        </div>
      )}

      <p className="text-xs text-gray-400 mt-2">Submitted: {formatDate(activation.submittedAt)}</p>
    </div>
  )
}