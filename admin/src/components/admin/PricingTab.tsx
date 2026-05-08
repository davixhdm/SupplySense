import { useState, useEffect } from 'react'
import { paymentService } from '../../services/paymentService'
import Input from '../common/Input'
import Button from '../common/Button'
import toast from 'react-hot-toast'

export default function PricingTab() {
  const [plans, setPlans] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await paymentService.getPlans()
        setPlans(res)
      } catch (err) {
        toast.error('Failed to load pricing')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await paymentService.updatePlans(plans)
      toast.success('Pricing updated')
    } catch (err) {
      toast.error('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const updatePlan = (plan: string, cycle: string, value: string) => {
    setPlans((prev: any) => ({
      ...prev,
      [plan]: { ...prev[plan], [cycle]: parseFloat(value) || 0 }
    }))
  }

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 max-w-2xl space-y-6">
      <div>
        <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">Standard Plan</h3>
        <div className="grid grid-cols-3 gap-4">
          <Input label="Monthly" type="number" value={plans?.standard?.monthly || ''} onChange={(e) => updatePlan('standard', 'monthly', e.target.value)} />
          <Input label="Yearly" type="number" value={plans?.standard?.yearly || ''} onChange={(e) => updatePlan('standard', 'yearly', e.target.value)} />
          <Input label="Permanent" type="number" value={plans?.standard?.permanent || ''} onChange={(e) => updatePlan('standard', 'permanent', e.target.value)} />
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">Pro+ Plan</h3>
        <div className="grid grid-cols-3 gap-4">
          <Input label="Monthly" type="number" value={plans?.proplus?.monthly || ''} onChange={(e) => updatePlan('proplus', 'monthly', e.target.value)} />
          <Input label="Yearly" type="number" value={plans?.proplus?.yearly || ''} onChange={(e) => updatePlan('proplus', 'yearly', e.target.value)} />
          <Input label="Permanent" type="number" value={plans?.proplus?.permanent || ''} onChange={(e) => updatePlan('proplus', 'permanent', e.target.value)} />
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">Trial</h3>
        <div className="w-48">
          <Input label="Duration (days)" type="number" value={plans?.trial?.duration || ''} onChange={(e) => setPlans((prev: any) => ({ ...prev, trial: { ...prev.trial, duration: parseInt(e.target.value) || 0 } }))} />
        </div>
      </div>

      <Button onClick={handleSave} loading={saving} className="w-full">Save Pricing</Button>
    </div>
  )
}