import { useState, useEffect } from 'react'
import { adminSettingsService } from '../../services/adminSettingsService'
import Input from '../common/Input'
import Button from '../common/Button'
import toast from 'react-hot-toast'
import { Brain, Bot, ExternalLink } from 'lucide-react'

export default function AIConfigTab() {
  const [config, setConfig] = useState({
    baseUrl: '',
    apiKey: '',
    landingChatEnabled: true,
    chatbotTitle: '',
    chatbotColor: '#2563eb'
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await adminSettingsService.getSystemSettings()
        if (res?.aiConfig) {
          setConfig({
            baseUrl: res.aiConfig.baseUrl || '',
            apiKey: res.aiConfig.apiKey || '',
            landingChatEnabled: res.aiConfig.landingChatEnabled !== false,
            chatbotTitle: res.aiConfig.chatbotTitle || 'SupplySense Assistant',
            chatbotColor: res.aiConfig.chatbotColor || '#2563eb'
          })
        }
      } catch (err) { toast.error('Failed to load AI config') }
      finally { setLoading(false) }
    }
    fetch()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await adminSettingsService.updateSystemSettings({ aiConfig: config })
      toast.success('AI configuration saved')
    } catch (err) { toast.error('Failed to save') }
    finally { setSaving(false) }
  }

  const handleTest = async () => {
    if (!config.baseUrl) { toast.error('Enter a base URL first'); return }
    setTesting(true)
    try {
      const response = await fetch(`${config.baseUrl}/api/health`)
      const data = await response.json()
      if (data.status === 'healthy') toast.success(`AI Engine online — ${data.service || 'Connected'}`)
      else toast.error('AI Engine returned unexpected response')
    } catch (err) { toast.error('Cannot reach AI Engine. Check the URL.') }
    finally { setTesting(false) }
  }

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 max-w-2xl space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg"><Brain size={24} className="text-purple-600" /></div>
        <div><h3 className="font-semibold text-gray-700 dark:text-gray-200">AI Engine Configuration</h3><p className="text-xs text-gray-500">Connect and control the AI analysis engine</p></div>
      </div>

      <div className="space-y-4">
        <Input label="AI Engine Base URL" placeholder="https://supplysense-ai-engine.onrender.com" value={config.baseUrl} onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })} />
        <Input label="API Key" type="password" placeholder="Internal API key" value={config.apiKey} onChange={(e) => setConfig({ ...config, apiKey: e.target.value })} />
        <Button variant="secondary" onClick={handleTest} loading={testing} className="w-full"><ExternalLink size={14} className="mr-2" /> Test Connection</Button>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">
        <h3 className="font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2"><Bot size={18} /> Landing Page Chatbot</h3>

        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={config.landingChatEnabled} onChange={() => setConfig({ ...config, landingChatEnabled: !config.landingChatEnabled })} className="w-4 h-4 rounded text-primary-600" />
          <div><p className="text-sm font-medium text-gray-700 dark:text-gray-200">Enable Chatbot</p><p className="text-xs text-gray-500">Show AI assistant on the landing page</p></div>
        </label>

        <Input label="Chatbot Title" placeholder="SupplySense Assistant" value={config.chatbotTitle} onChange={(e) => setConfig({ ...config, chatbotTitle: e.target.value })} />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Chatbot Accent Color</label>
          <div className="flex items-center gap-3">
            <input type="color" value={config.chatbotColor} onChange={(e) => setConfig({ ...config, chatbotColor: e.target.value })} className="w-12 h-10 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer" />
            <span className="text-sm text-gray-500">{config.chatbotColor}</span>
          </div>
        </div>
      </div>

      <Button onClick={handleSave} loading={saving} className="w-full">Save AI Configuration</Button>
    </div>
  )
}