import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Navbar from '../../components/landing/Navbar'
import Footer from '../../components/landing/Footer'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Modal from '../../components/common/Modal'
import api from '../../services/api'
import { authService } from '../../services/authService'
import { useAuthStore } from '../../store/authStore'
import { formatCurrency } from '../../utils/helpers'
import { Loader, AlertTriangle, Check } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const [searchParams] = useSearchParams()
  const plan = searchParams.get('plan') || 'standard'
  const billing = searchParams.get('billing') || 'monthly'
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [step, setStep] = useState<'select' | 'auto_form' | 'manual_guide' | 'success'>('select')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [autoForm, setAutoForm] = useState({ phone: '', cardNumber: '', cardExpiry: '', cardCvc: '' })
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    api.get('/client/auth/public-settings').then(res => { if (res.data) setSettings(res.data) }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading || !settings) return <div className="min-h-screen flex items-center justify-center"><Loader className="animate-spin" size={32} /></div>

  const pricing = settings.pricing || {}
  const currency = settings.paymentConfig?.currency || 'KSh'
  const amount = pricing[plan]?.[billing] || 0
  const planName = plan === 'standard' ? 'Standard' : 'Pro+'

  const enabledMethods = []
  if (settings.paymentConfig?.stripeEnabled) enabledMethods.push({ key: 'stripe', label: 'Credit/Debit Card (Stripe)', icon: '💳' })
  if (settings.paymentConfig?.paypalEnabled) enabledMethods.push({ key: 'paypal', label: 'PayPal', icon: '🅿️' })
  if (settings.paymentConfig?.mpesaEnabled) {
    if (settings.paymentConfig?.mpesaSubMethods?.stkPush) enabledMethods.push({ key: 'mpesa_stk', label: 'M-Pesa STK Push', icon: '📱' })
    if (settings.paymentConfig?.mpesaSubMethods?.sendMoney) enabledMethods.push({ key: 'mpesa_send', label: 'M-Pesa Send Money', icon: '💰' })
    if (settings.paymentConfig?.mpesaSubMethods?.paybill) enabledMethods.push({ key: 'mpesa_paybill', label: 'M-Pesa Paybill', icon: '🏦' })
    if (settings.paymentConfig?.mpesaSubMethods?.till) enabledMethods.push({ key: 'mpesa_till', label: 'M-Pesa Till', icon: '🛒' })
  }

  const handleMethodSelect = (key: string) => {
    setPaymentMethod(key)
    if (key === 'stripe' || key === 'mpesa_stk' || key === 'paypal') setStep('auto_form')
    else setStep('manual_guide')
  }

  const handleManualConfirm = async () => {
    setProcessing(true)
    try {
      await authService.submitManualPayment({ plan, billingCycle: billing, amount, currency, paymentMethod, paymentDetails: { phoneNumber: autoForm.phone } })
      setStep('success')
      toast.success('Payment submitted for verification')
    } catch (err: any) { toast.error(err?.response?.data?.message || 'Submission failed') }
    finally { setProcessing(false) }
  }

  const manualGuide = () => {
    const nums = settings.paymentConfig?.mpesaNumbers || {}
    if (paymentMethod === 'mpesa_send') return <div className="space-y-2 text-sm"><p>1. Go to <strong>M-Pesa → Send Money</strong></p><p>2. Enter phone: <strong>{nums.sendMoneyPhone || '07XX XXX XXX'}</strong></p><p>3. Name: <strong>SupplySense</strong></p><p>4. Amount: <strong>{formatCurrency(amount, currency)}</strong></p><p>5. Enter PIN and send</p></div>
    if (paymentMethod === 'mpesa_paybill') return <div className="space-y-2 text-sm"><p>1. Go to <strong>M-Pesa → Lipa na M-Pesa → Paybill</strong></p><p>2. Business Number: <strong>{nums.paybillBusinessNumber || 'XXXXXX'}</strong></p><p>3. Account Number: <strong>{user?.phone || 'Your phone'}</strong></p><p>4. Amount: <strong>{formatCurrency(amount, currency)}</strong></p><p>5. Enter PIN and send</p></div>
    if (paymentMethod === 'mpesa_till') return <div className="space-y-2 text-sm"><p>1. Go to <strong>M-Pesa → Buy Goods & Services</strong></p><p>2. Till Number: <strong>{nums.tillNumber || 'XXXXXX'}</strong></p><p>3. Name: <strong>{nums.tillBusinessName || 'SupplySense'}</strong></p><p>4. Amount: <strong>{formatCurrency(amount, currency)}</strong></p><p>5. Enter PIN and send</p></div>
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center mb-2">Checkout</h1>
          <p className="text-gray-500 dark:text-gray-400 text-center mb-8">{planName} · {billing} · {formatCurrency(amount, currency)}</p>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-6">
            {step === 'select' && (
              <>
                <h3 className="font-semibold text-gray-700 dark:text-gray-200">Select Payment Method</h3>
                <div className="space-y-2">
                  {enabledMethods.map(m => (
                    <button key={m.key} onClick={() => handleMethodSelect(m.key)} className="w-full flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all text-left">
                      <span className="text-2xl">{m.icon}</span><span className="text-sm font-medium text-gray-900 dark:text-gray-100">{m.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
            {step === 'auto_form' && (
              <>
                <h3 className="font-semibold text-gray-700 dark:text-gray-200">{paymentMethod === 'stripe' ? 'Card Details' : paymentMethod === 'mpesa_stk' ? 'M-Pesa STK Push' : 'PayPal'}</h3>
                {paymentMethod === 'mpesa_stk' && <div className="space-y-3"><Input label="M-Pesa Phone" placeholder="2547XXXXXXXX" value={autoForm.phone} onChange={(e) => setAutoForm({ ...autoForm, phone: e.target.value })} /><p className="text-xs text-gray-400">You will receive a popup to enter your PIN.</p></div>}
                {paymentMethod === 'stripe' && <div className="space-y-3"><Input label="Card Number" placeholder="4242 4242 4242 4242" value={autoForm.cardNumber} onChange={(e) => setAutoForm({ ...autoForm, cardNumber: e.target.value })} /><div className="grid grid-cols-2 gap-3"><Input label="Expiry" placeholder="MM/YY" value={autoForm.cardExpiry} onChange={(e) => setAutoForm({ ...autoForm, cardExpiry: e.target.value })} /><Input label="CVC" placeholder="123" value={autoForm.cardCvc} onChange={(e) => setAutoForm({ ...autoForm, cardCvc: e.target.value })} /></div></div>}
                {paymentMethod === 'paypal' && <p className="text-sm text-gray-500">You will be redirected to PayPal.</p>}
                <Button onClick={handleManualConfirm} loading={processing} className="w-full">Pay {formatCurrency(amount, currency)}</Button>
                <button onClick={() => setStep('select')} className="w-full text-sm text-gray-500 hover:underline">← Back</button>
              </>
            )}
            {step === 'manual_guide' && (
              <>
                <h3 className="font-semibold text-gray-700 dark:text-gray-200">Payment Instructions</h3>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">{manualGuide()}</div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3"><p className="text-xs text-yellow-700 dark:text-yellow-400">⚠️ Complete payment on your phone first, then click below.</p></div>
                <Button onClick={() => setShowConfirm(true)} className="w-full">I Have Paid</Button>
                <button onClick={() => setStep('select')} className="w-full text-sm text-gray-500 hover:underline">← Back</button>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer settings={settings} onLegalClick={() => {}} />
      <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="Confirm Payment">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p className="font-medium text-gray-900 dark:text-gray-100 mb-2">Before submitting:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Amount: <strong>{formatCurrency(amount, currency)}</strong></li>
                <li>Correct payment method</li>
                <li>Submit within <strong>3 hours</strong></li>
                <li>Key sent within 24 hours</li>
              </ul>
            </div>
          </div>
          <div className="flex gap-2"><Button variant="secondary" onClick={() => setShowConfirm(false)} className="flex-1">Cancel</Button><Button onClick={handleManualConfirm} loading={processing} className="flex-1">Confirm & Submit</Button></div>
        </div>
      </Modal>
      <Modal isOpen={step === 'success'} onClose={() => navigate('/login')} title="Payment Submitted">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto"><Check size={32} className="text-green-600" /></div>
          <p className="text-gray-600 dark:text-gray-400">Your payment has been submitted for verification.</p>
          <p className="text-sm text-gray-500">License key sent via SMS & Email within 24 hours.</p>
          <Button onClick={() => navigate('/login')} className="w-full">Go to Login</Button>
        </div>
      </Modal>
    </div>
  )
}