import { useState, useEffect } from 'react'
import { adminSettingsService } from '../../services/adminSettingsService'
import Input from '../common/Input'
import Button from '../common/Button'
import toast from 'react-hot-toast'

export default function GeneralTab() {
  const [form, setForm] = useState<any>({
    email: '',
    phone: '',
    address: '',
    aboutContent: '',
    heroTitle: '',
    heroSubtitle: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await adminSettingsService.getSystemSettings()
        if (res) {
          setForm({
            email: res.general?.email || res.brevoSender || '',
            phone: res.general?.phone || '',
            address: res.general?.address || '',
            aboutContent: res.general?.aboutContent || '',
            heroTitle: res.general?.heroTitle || 'Intelligent Supply Chain Management',
            heroSubtitle: res.general?.heroSubtitle || 'Predict, monitor, and optimize your supply chain with AI-powered insights.'
          })
        }
      } catch (err) {
        toast.error('Failed to load settings')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await adminSettingsService.updateSystemSettings({ general: form })
      toast.success('Settings saved')
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
        <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">Contact Information</h3>
        <div className="space-y-3">
          <Input
            label="Support Email"
            type="email"
            placeholder="support@supplysense.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            label="Support Phone"
            placeholder="+254 700 000 000"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <Input
            label="Address"
            placeholder="Nairobi, Kenya"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">Landing Page Content</h3>
        <div className="space-y-3">
          <Input
            label="Hero Title"
            value={form.heroTitle}
            onChange={(e) => setForm({ ...form, heroTitle: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hero Subtitle</label>
            <textarea
              value={form.heroSubtitle}
              onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">About Content</label>
            <textarea
              value={form.aboutContent}
              onChange={(e) => setForm({ ...form, aboutContent: e.target.value })}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm"
              placeholder="Write about SupplySense..."
            />
          </div>
        </div>
      </div>

      <Button onClick={handleSave} loading={saving} className="w-full">Save Settings</Button>
    </div>
  )
}