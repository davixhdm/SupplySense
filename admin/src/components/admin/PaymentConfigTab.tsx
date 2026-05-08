import { useState, useEffect } from 'react'
import { paymentService } from '../../services/paymentService'
import Button from '../common/Button'
import { CURRENCIES } from '../../utils/constants'
import toast from 'react-hot-toast'

export default function PaymentConfigTab() {
  const [config, setConfig] = useState<any>({
    stripeEnabled: false,
    mpesaEnabled: false,
    paypalEnabled: false,
    mpesaSubMethods: { stkPush: false, sendMoney: false, paybill: false, till: false },
    currency: 'KSh'
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await paymentService.getConfig()
        if (res) setConfig(prev => ({ ...prev, ...res }))
      } catch (err) {
        toast.error('Failed to load config')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await paymentService.updatePlans({ paymentConfig: config })
      toast.success('Configuration saved')
    } catch (err) {
      toast.error('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 max-w-2xl space-y-6">
      <div>
        <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">Currency</h3>
        <div className="flex gap-4">
          {CURRENCIES.map((cur) => (
            <label key={cur} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="currency"
                value={cur}
                checked={config.currency === cur}
                onChange={() => setConfig((prev: any) => ({ ...prev, currency: cur }))}
                className="text-primary-600"
              />
              <span className="text-sm">{cur}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">
        <h3 className="font-semibold text-gray-700 dark:text-gray-200">Payment Methods</h3>

        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={config.stripeEnabled} onChange={() => setConfig((prev: any) => ({ ...prev, stripeEnabled: !prev.stripeEnabled }))} className="w-4 h-4 rounded text-primary-600" />
          <div><p className="text-sm font-medium">Stripe</p><p className="text-xs text-gray-500">Credit/Debit cards</p></div>
        </label>

        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={config.mpesaEnabled} onChange={() => setConfig((prev: any) => ({ ...prev, mpesaEnabled: !prev.mpesaEnabled }))} className="w-4 h-4 rounded text-primary-600" />
            <div><p className="text-sm font-medium">M-Pesa</p><p className="text-xs text-gray-500">Safaricom mobile money</p></div>
          </label>

          {config.mpesaEnabled && (
            <div className="ml-7 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={config.mpesaSubMethods.stkPush} onChange={() => setConfig((prev: any) => ({ ...prev, mpesaSubMethods: { ...prev.mpesaSubMethods, stkPush: !prev.mpesaSubMethods.stkPush } }))} className="w-3.5 h-3.5 rounded text-primary-600" />
                <span className="text-xs">STK Push (Instant)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={config.mpesaSubMethods.sendMoney} onChange={() => setConfig((prev: any) => ({ ...prev, mpesaSubMethods: { ...prev.mpesaSubMethods, sendMoney: !prev.mpesaSubMethods.sendMoney } }))} className="w-3.5 h-3.5 rounded text-primary-600" />
                <span className="text-xs">Send Money</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={config.mpesaSubMethods.paybill} onChange={() => setConfig((prev: any) => ({ ...prev, mpesaSubMethods: { ...prev.mpesaSubMethods, paybill: !prev.mpesaSubMethods.paybill } }))} className="w-3.5 h-3.5 rounded text-primary-600" />
                <span className="text-xs">Paybill</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={config.mpesaSubMethods.till} onChange={() => setConfig((prev: any) => ({ ...prev, mpesaSubMethods: { ...prev.mpesaSubMethods, till: !prev.mpesaSubMethods.till } }))} className="w-3.5 h-3.5 rounded text-primary-600" />
                <span className="text-xs">Buy Goods / Till</span>
              </label>
            </div>
          )}
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={config.paypalEnabled} onChange={() => setConfig((prev: any) => ({ ...prev, paypalEnabled: !prev.paypalEnabled }))} className="w-4 h-4 rounded text-primary-600" />
          <div><p className="text-sm font-medium">PayPal</p><p className="text-xs text-gray-500">PayPal checkout</p></div>
        </label>
      </div>

      <Button onClick={handleSave} loading={saving} className="w-full">Save Configuration</Button>
    </div>
  )
}