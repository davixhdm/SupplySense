import { useState } from 'react'
import { DashboardLayout } from '../../../layouts/DashboardLayout'
import { Widget } from '../../../components/dashboard/Widget'
import { Button } from '../../../components/common/Button'
import { AlertBanner } from '../../../components/common/AlertBanner'
import { Download, RefreshCw, Clock, HardDrive } from 'lucide-react'

interface BackupRecord {
  id: string
  date: string
  size: string
  status: 'completed' | 'in-progress' | 'failed'
}

export default function BackupPage() {
  const [backups, setBackups] = useState<BackupRecord[]>([
    {
      id: '1',
      date: '2026-05-05 02:00 AM',
      size: '2.4 GB',
      status: 'completed',
    },
    {
      id: '2',
      date: '2026-05-04 02:00 AM',
      size: '2.3 GB',
      status: 'completed',
    },
    {
      id: '3',
      date: '2026-05-03 02:00 AM',
      size: '2.2 GB',
      status: 'completed',
    },
  ])

  const [autoBackup, setAutoBackup] = useState(true)
  const [backupFrequency, setBackupFrequency] = useState('daily')
  const [isBackingUp, setIsBackingUp] = useState(false)
  const [lastBackupTime, setLastBackupTime] = useState('Today at 2:00 AM')

  const handleBackupNow = async () => {
    setIsBackingUp(true)
    try {
      // Simulate backup process
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setLastBackupTime('Just now')
      setBackups([
        {
          id: Date.now().toString(),
          date: new Date().toLocaleString(),
          size: '2.5 GB',
          status: 'completed',
        },
        ...backups,
      ])
    } catch (error) {
      console.error('Backup failed:', error)
    } finally {
      setIsBackingUp(false)
    }
  }

  const handleDownloadBackup = (backupId: string) => {
    console.log(`Downloading backup: ${backupId}`)
    // Implement download logic
  }

  const handleDeleteBackup = (backupId: string) => {
    setBackups(backups.filter((b) => b.id !== backupId))
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Backup & Recovery</h1>
          <p className="text-gray-600 mt-1">Manage your data backups and recovery options</p>
        </div>

        {/* Backup Status */}
        <Widget title="Backup Status" icon={<HardDrive className="w-5 h-5" />}>
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Last Backup</p>
                  <p className="text-lg font-semibold text-gray-900">{lastBackupTime}</p>
                </div>
                <Button
                  onClick={handleBackupNow}
                  disabled={isBackingUp}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${isBackingUp ? 'animate-spin' : ''}`} />
                  {isBackingUp ? 'Backing up...' : 'Backup Now'}
                </Button>
              </div>
            </div>
          </div>
        </Widget>

        {/* Backup Settings */}
        <Widget title="Backup Settings">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Automatic Backups</p>
                <p className="text-sm text-gray-600">Automatically backup your data</p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoBackup}
                  onChange={(e) => setAutoBackup(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded"
                />
              </label>
            </div>

            {autoBackup && (
              <div className="border-t pt-6">
                <p className="font-medium text-gray-900 mb-3">Backup Frequency</p>
                <select
                  value={backupFrequency}
                  onChange={(e) => setBackupFrequency(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily (at 2:00 AM)</option>
                  <option value="weekly">Weekly (Every Sunday at 2:00 AM)</option>
                  <option value="monthly">Monthly (1st of month at 2:00 AM)</option>
                </select>
              </div>
            )}
          </div>
        </Widget>

        {/* Backup History */}
        <Widget title="Backup History">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Size</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {backups.map((backup) => (
                  <tr key={backup.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{backup.date}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{backup.size}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        {backup.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm space-x-2 flex">
                      <button
                        onClick={() => handleDownloadBackup(backup.id)}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                      <button
                        onClick={() => handleDeleteBackup(backup.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Widget>
      </div>
    </DashboardLayout>
  )
}
