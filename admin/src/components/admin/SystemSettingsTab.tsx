import { useState, useEffect } from 'react'
import { adminSettingsService } from '../../services/adminSettingsService'
import Input from '../common/Input'
import Button from '../common/Button'
import toast from 'react-hot-toast'

export default function SystemSettingsTab() {
  const [settings, setSettings] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await adminSettingsService.getSystemSettings()
        setSettings(res)
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
      await adminSettingsService.updateSystemSettings(settings)
      toast.success('Settings saved')
    } catch (err) {
      toast.error('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4 max-w-2xl">
      <Input label="System Name" value={settings.systemName || ''} onChange={(e) => setSettings({ ...settings, systemName: e.target.value })} />
      <Input label="License Key Prefix" value={settings.licenseKeyPrefix || ''} onChange={(e) => setSettings({ ...settings, licenseKeyPrefix: e.target.value })} />
      <Input label="Trial Duration (days)" type="number" value={settings.trialDuration || ''} onChange={(e) => setSettings({ ...settings, trialDuration: e.target.value })} />
      <Input label="Client URL" value={settings.clientAppUrl || ''} onChange={(e) => setSettings({ ...settings, clientAppUrl: e.target.value })} />
      <Input label="Admin URL" value={settings.adminAppUrl || ''} onChange={(e) => setSettings({ ...settings, adminAppUrl: e.target.value })} />
      <Input label="Sender Email" value={settings.brevoSender || ''} onChange={(e) => setSettings({ ...settings, brevoSender: e.target.value })} />
      <Button onClick={handleSave} loading={saving}>Save Settings</Button>
    </div>
  )
}