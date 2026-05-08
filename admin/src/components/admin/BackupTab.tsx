import { useState, useEffect } from 'react'
import { adminSettingsService } from '../../services/adminSettingsService'
import Button from '../common/Button'
import Input from '../common/Input'
import Modal from '../common/Modal'
import { formatDate } from '../../utils/helpers'
import { Download, Mail, Clock, Upload, RefreshCw, Trash2, Share2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function BackupTab() {
  const [backups, setBackups] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [restoring, setRestoring] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [sharing, setSharing] = useState<string | null>(null)
  const [showSchedule, setShowSchedule] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [shareFilename, setShareFilename] = useState('')
  const [shareEmail, setShareEmail] = useState('')
  const [schedule, setSchedule] = useState({ enabled: false, frequency: 'daily', time: '02:00', email: '', sendOnBackup: false })
  const [importFile, setImportFile] = useState<File | null>(null)

  const fetchBackups = async () => {
    setLoading(true)
    try {
      const res = await adminSettingsService.getBackups()
      setBackups(Array.isArray(res) ? res : [])
    } catch (err) {
      toast.error('Failed to load backups')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBackups() }, [])

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await adminSettingsService.getSystemSettings()
        if (res?.backupSchedule) setSchedule(res.backupSchedule)
      } catch (err) {}
    }
    fetchSchedule()
  }, [])

  const handleCreate = async () => {
    setCreating(true)
    try {
      const res = await adminSettingsService.createBackup()
      if (schedule.enabled && schedule.sendOnBackup && schedule.email) {
        try {
          await adminSettingsService.emailBackup(res.filename)
          toast.success('Backup created and emailed')
        } catch {
          toast.success('Backup created')
        }
      } else {
        toast.success('Backup created')
      }
      fetchBackups()
    } catch (err) {
      toast.error('Failed to create backup')
    } finally {
      setCreating(false)
    }
  }

  const handleDownload = async (filename: string) => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
      const token = localStorage.getItem('supplysense-admin-auth')
      const parsed = token ? JSON.parse(token) : null
      const authToken = parsed?.state?.token

      const response = await fetch(`${baseUrl}/admin/backups/download/${filename}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      })
      if (!response.ok) throw new Error('Download failed')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      toast.success('Download started')
    } catch (err) {
      toast.error('Download failed')
    }
  }

  const handleDelete = async (filename: string) => {
    setDeleting(filename)
    try {
      await adminSettingsService.deleteBackup(filename)
      toast.success('Backup deleted')
      fetchBackups()
    } catch (err) {
      toast.error('Failed to delete')
    } finally {
      setDeleting(null)
    }
  }

  const handleShareClick = (filename: string) => {
    setShareFilename(filename)
    setShareEmail(schedule.email || '')
    setShowShare(true)
  }

  const handleShareSend = async () => {
    if (!shareEmail) {
      toast.error('Email is required')
      return
    }
    setSharing(shareFilename)
    try {
      await adminSettingsService.shareBackup(shareFilename, shareEmail)
      toast.success('Backup shared via email')
      setShowShare(false)
      setShareFilename('')
      setShareEmail('')
    } catch (err) {
      toast.error('Failed to share')
    } finally {
      setSharing(null)
    }
  }

  const handleRestore = async (filename: string) => {
    if (!confirm('Restoring will overwrite current data. Continue?')) return
    setRestoring(filename)
    try {
      await adminSettingsService.restoreBackup(filename)
      toast.success('Backup restored')
    } catch (err) {
      toast.error('Failed to restore')
    } finally {
      setRestoring(null)
    }
  }

  const handleScheduleSave = async () => {
    try {
      await adminSettingsService.updateSchedule(schedule)
      toast.success('Schedule saved')
      setShowSchedule(false)
    } catch (err) {
      toast.error('Failed to save schedule')
    }
  }

  const handleImport = async () => {
    if (!importFile) {
      toast.error('Select a file first')
      return
    }
    if (!confirm('Importing will overwrite current data. Continue?')) return
    try {
      const formData = new FormData()
      formData.append('backup', importFile)
      await adminSettingsService.importBackup(formData)
      toast.success('Backup imported and restored')
      setShowImport(false)
      setImportFile(null)
      fetchBackups()
    } catch (err) {
      toast.error('Import failed')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="font-semibold text-gray-700 dark:text-gray-200">System Backups</h3>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => setShowSchedule(true)}>
            <Clock size={14} className="mr-1" /> Schedule
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setShowImport(true)}>
            <Upload size={14} className="mr-1" /> Import
          </Button>
          <Button size="sm" onClick={handleCreate} loading={creating}>
            <RefreshCw size={14} className="mr-1" /> Backup Now
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>
      ) : backups.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <p>No backups yet</p>
          <p className="text-xs mt-1">Create your first backup to secure your data</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs">Filename</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs">Size</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs">Date</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500 uppercase text-xs">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {backups.map((backup, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="px-4 py-3 font-mono text-xs">{backup.filename}</td>
                  <td className="px-4 py-3 text-gray-500">{backup.size}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(backup.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => handleDownload(backup.filename)} className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500" title="Download">
                        <Download size={14} />
                      </button>
                      <button onClick={() => handleShareClick(backup.filename)} className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500" title="Share via Email">
                        <Share2 size={14} />
                      </button>
                      <button
                        onClick={() => handleRestore(backup.filename)}
                        disabled={restoring === backup.filename}
                        className="p-1.5 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500 text-xs font-medium disabled:opacity-50"
                        title="Restore"
                      >
                        {restoring === backup.filename ? '...' : 'Restore'}
                      </button>
                      <button
                        onClick={() => handleDelete(backup.filename)}
                        disabled={deleting === backup.filename}
                        className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 disabled:opacity-50"
                        title="Delete"
                      >
                        {deleting === backup.filename ? '...' : <Trash2 size={14} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={showSchedule} onClose={() => setShowSchedule(false)} title="Auto Backup Schedule">
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={schedule.enabled}
              onChange={() => setSchedule({ ...schedule, enabled: !schedule.enabled })}
              className="w-4 h-4 rounded text-primary-600"
            />
            <span className="text-sm font-medium">Enable automatic backups</span>
          </label>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Frequency</label>
            <select
              value={schedule.frequency}
              onChange={(e) => setSchedule({ ...schedule, frequency: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm"
              disabled={!schedule.enabled}
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <Input
            label="Time (24h format)"
            type="time"
            value={schedule.time}
            onChange={(e) => setSchedule({ ...schedule, time: e.target.value })}
            disabled={!schedule.enabled}
          />

          <Input
            label="Email backup to"
            type="email"
            placeholder="admin@example.com"
            value={schedule.email}
            onChange={(e) => setSchedule({ ...schedule, email: e.target.value })}
            disabled={!schedule.enabled}
          />

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={schedule.sendOnBackup}
              onChange={() => setSchedule({ ...schedule, sendOnBackup: !schedule.sendOnBackup })}
              className="w-4 h-4 rounded text-primary-600"
              disabled={!schedule.enabled}
            />
            <span className="text-sm">Automatically send backup to email when created</span>
          </label>

          <Button onClick={handleScheduleSave} className="w-full">Save Schedule</Button>
        </div>
      </Modal>

      <Modal isOpen={showImport} onClose={() => { setShowImport(false); setImportFile(null) }} title="Import Backup">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select backup file (.json)</label>
            <input
              type="file"
              accept=".json"
              onChange={(e) => setImportFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
            />
            {importFile && <p className="text-xs text-gray-500 mt-1">Selected: {importFile.name}</p>}
          </div>
          <Button onClick={handleImport} disabled={!importFile} className="w-full">Import & Restore</Button>
        </div>
      </Modal>

      <Modal isOpen={showShare} onClose={() => setShowShare(false)} title="Share Backup">
        <div className="space-y-4">
          <p className="text-xs text-gray-500">Filename: {shareFilename}</p>
          <Input
            label="Recipient Email"
            type="email"
            placeholder="admin@example.com"
            value={shareEmail}
            onChange={(e) => setShareEmail(e.target.value)}
          />
          <Button onClick={handleShareSend} loading={sharing === shareFilename} className="w-full">Send via Email</Button>
        </div>
      </Modal>
    </div>
  )
}