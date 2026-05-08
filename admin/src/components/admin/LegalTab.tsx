import { useState, useEffect } from 'react'
import { adminSettingsService } from '../../services/adminSettingsService'
import Button from '../common/Button'
import toast from 'react-hot-toast'

const LEGAL_TABS = [
  { key: 'terms', label: 'Terms & Conditions' },
  { key: 'privacy', label: 'Privacy Policy' },
  { key: 'cookies', label: 'Cookies Policy' }
]

export default function LegalTab() {
  const [activeDoc, setActiveDoc] = useState('terms')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const res = await adminSettingsService.getLegal(activeDoc)
        setContent(typeof res === 'string' ? res : res?.content || '')
      } catch (err) {
        setContent('')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [activeDoc])

  const handleSave = async () => {
    setSaving(true)
    try {
      await adminSettingsService.updateLegal(activeDoc, content)
      toast.success('Document saved')
    } catch (err) {
      toast.error('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="flex gap-4 mb-4 border-b border-gray-200 dark:border-gray-700">
        {LEGAL_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveDoc(tab.key)}
            className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeDoc === tab.key ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={20}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm font-mono resize-y"
            placeholder="Enter HTML content..."
          />
          <Button onClick={handleSave} loading={saving} className="mt-4">Save Document</Button>
        </div>
      )}
    </div>
  )
}