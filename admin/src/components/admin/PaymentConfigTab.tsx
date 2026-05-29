import { useState, useEffect } from 'react'
import { paymentService } from '../../services/paymentService'
import Button from '../common/Button'
import Input from '../common/Input'
import { CURRENCIES } from '../../utils/constants'
import toast from 'react-hot-toast'

export default function PaymentConfigTab() {
  const [config, setConfig] = useState<any>({
    stripeEnabled: false,
    mpesaEnabled: false,
    paypalEnabled: false,
    mpesaSubMethods: { stkPush: false, sendMoney: false, paybill: false, till: false },
    mpesaNumbers: { sendMoneyPhone: '', paybillBusinessNumber: '', paybillAccountName: '', tillNumber: '', tillBusinessName: '' },
    currency: 'KSh'
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await paymentService.getConfig()
        if (res) setConfig((prev: any) => ({ ...prev, ...res, mpesaNumbers: { ...prev.mpesaNumbers, ...(res.mpesaNumbers || {}) } }))
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

  const updateMpesaNumbers = (key: string, value: string) => {
    setConfig((prev: any) => ({
      ...prev,
      mpesaNumbers: { ...prev.mpesaNumbers, [key]: value }
    }))
  }

  const toggleMpesaSub = (key: string) => {
    setConfig((prev: any) => ({
      ...prev,
      mpesaSubMethods: { ...prev.mpesaSubMethods, [key]: !prev.mpesaSubMethods[key] }
    }))
  }

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 max-w-2xl space-y-6">
      {/* Currency */}
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

      {/* Stripe */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">
        <h3 className="font-semibold text-gray-700 dark:text-gray-200">Payment Methods</h3>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={config.stripeEnabled}
            onChange={() => setConfig((prev: any) => ({ ...prev, stripeEnabled: !prev.stripeEnabled }))}
            className="w-4 h-4 rounded text-primary-600"
          />
          <div>
            <p className="text-sm font-medium">Stripe</p>
            <p className="text-xs text-gray-500">Credit/Debit cards — keys in .env</p>
          </div>
        </label>

        {/* M-Pesa */}
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={config.mpesaEnabled}
              onChange={() => setConfig((prev: any) => ({ ...prev, mpesaEnabled: !prev.mpesaEnabled }))}
              className="w-4 h-4 rounded text-primary-600"
            />
            <div>
              <p className="text-sm font-medium">M-Pesa</p>
              <p className="text-xs text-gray-500">Safaricom mobile money — keys in .env</p>
            </div>
          </label>

          {config.mpesaEnabled && (
            <div className="ml-7 space-y-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              {/* STK Push */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.mpesaSubMethods.stkPush}
                  onChange={() => toggleMpesaSub('stkPush')}
                  className="w-3.5 h-3.5 rounded text-primary-600"
                />
                <span className="text-xs font-medium">STK Push (Instant popup)</span>
              </label>

              {/* Send Money */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.mpesaSubMethods.sendMoney}
                    onChange={() => toggleMpesaSub('sendMoney')}
                    className="w-3.5 h-3.5 rounded text-primary-600"
                  />
                  <span className="text-xs font-medium">Send Money (Manual to phone)</span>
                </label>
                {config.mpesaSubMethods.sendMoney && (
                  <div className="ml-5">
                    <Input
                      label="Receive Phone Number"
                      placeholder="07XX XXX XXX"
                      value={config.mpesaNumbers.sendMoneyPhone}
                      onChange={(e) => updateMpesaNumbers('sendMoneyPhone', e.target.value)}
                    />
                    <p className="text-xs text-gray-400 mt-1">Customer sends money to this number</p>
                  </div>
                )}
              </div>

              {/* Paybill */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.mpesaSubMethods.paybill}
                    onChange={() => toggleMpesaSub('paybill')}
                    className="w-3.5 h-3.5 rounded text-primary-600"
                  />
                  <span className="text-xs font-medium">Paybill (Manual to business number)</span>
                </label>
                {config.mpesaSubMethods.paybill && (
                  <div className="ml-5 space-y-2">
                    <Input
                      label="Business Number"
                      placeholder="XXXXXX"
                      value={config.mpesaNumbers.paybillBusinessNumber}
                      onChange={(e) => updateMpesaNumbers('paybillBusinessNumber', e.target.value)}
                    />
                    <Input
                      label="Account Name"
                      placeholder="SupplySense"
                      value={config.mpesaNumbers.paybillAccountName}
                      onChange={(e) => updateMpesaNumbers('paybillAccountName', e.target.value)}
                    />
                    <p className="text-xs text-gray-400">Customer uses their phone number as account number</p>
                  </div>
                )}
              </div>

              {/* Till */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.mpesaSubMethods.till}
                    onChange={() => toggleMpesaSub('till')}
                    className="w-3.5 h-3.5 rounded text-primary-600"
                  />
                  <span className="text-xs font-medium">Buy Goods / Till (Manual to till number)</span>
                </label>
                {config.mpesaSubMethods.till && (
                  <div className="ml-5 space-y-2">
                    <Input
                      label="Till Number"
                      placeholder="XXXXXX"
                      value={config.mpesaNumbers.tillNumber}
                      onChange={(e) => updateMpesaNumbers('tillNumber', e.target.value)}
                    />
                    <Input
                      label="Business Name"
                      placeholder="SupplySense"
                      value={config.mpesaNumbers.tillBusinessName}
                      onChange={(e) => updateMpesaNumbers('tillBusinessName', e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* PayPal */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={config.paypalEnabled}
            onChange={() => setConfig((prev: any) => ({ ...prev, paypalEnabled: !prev.paypalEnabled }))}
            className="w-4 h-4 rounded text-primary-600"
          />
          <div>
            <p className="text-sm font-medium">PayPal</p>
            <p className="text-xs text-gray-500">PayPal checkout — keys in .env</p>
          </div>
        </label>
      </div>

      <Button onClick={handleSave} loading={saving} className="w-full">Save Configuration</Button>
    </div>
  )
}