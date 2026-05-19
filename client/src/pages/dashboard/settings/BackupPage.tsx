import { useState, useEffect } from 'react'
import { DashboardLayout } from '../../../layouts/DashboardLayout'
import { Widget } from '../../../components/dashboard/Widget'
import { Button } from '../../../components/common/Button'
import { AlertBanner } from '../../../components/common/AlertBanner'
import { AlertCircle, Download, RefreshCw, Clock, HardDrive } from 'lucide-react'
import { backupService } from '../../../services'
import { useApiPaginated, useApiMutation } from '../../../hooks'

interface BackupRecord {
  id?: string
  _id?: string
  filename?: string
  date?: string
  size?: string
  status?: 'completed' | 'in-progress' | 'failed'
  createdAt?: string
}

export default function BackupPage() {
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isBackingUp, setIsBackingUp] = useState(false)
  const [lastBackupTime, setLastBackupTime] = useState('Unknown')

  // Fetch backups
  const {
    data: backups,
    loading,
    error: backupsError,
    refetch,
  } = useApiPaginated(backupService.getBackups, 1, 20)

  // Mutation for creating backup
  const { mutate: createBackup } = useApiMutation(
    () => backupService.createBackup()
  )

  const handleBackupNow = async () => {
    try {
      setIsBackingUp(true)
      setError(null)
      await createBackup()
      setLastBackupTime(new Date().toLocaleString())
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      refetch()
    } catch (err) {
      setError('Failed to create backup')
      console.error('Backup failed:', err)
    } finally {
      setIsBackingUp(false)
    }
  }

  const handleDownloadBackup = async (filename: string) => {
    try {
      setError(null)
      await backupService.downloadBackup(filename)
    } catch (err) {
      setError('Failed to download backup')
      console.error('Failed to download backup:', err)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Backup & Recovery</h1>
          <p className="text-gray-600 mt-1">Manage your data backups and recovery options</p>
        </div>

        {saved && (
          <AlertBanner type="success" message="Backup created successfully" />
        )}

        {(error || backupsError) && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error || backupsError}</p>
          </div>
        )}

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
                  loading={isBackingUp}
                >
                  <RefreshCw className={`w-4 h-4 ${isBackingUp ? 'animate-spin' : ''}`} />
                  {isBackingUp ? 'Backing up...' : 'Backup Now'}
                </Button>
              </div>
            </div>
          </div>
        </Widget>

        {/* Backup History */}
        <Widget title="Backup History">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : backups.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Filename</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Size</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {backups.map((backup) => (
                    <tr key={backup._id || backup.id}>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {new Date(backup.createdAt || backup.date).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{backup.filename}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{backup.size || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            backup.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : backup.status === 'in-progress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {backup.status || 'completed'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {backup.status === 'completed' && (
                          <button
                            onClick={() => handleDownloadBackup(backup.filename)}
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 py-8 text-center">No backups found</p>
          )}
        </Widget>

        {/* Recovery Info */}
        <Widget title="Backup Information">
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                Regular backups are automatically created to protect your data. You can also create manual backups
                at any time using the "Backup Now" button above. Backups are stored securely and can be downloaded
                for safekeeping.
              </p>
            </div>
          </div>
        </Widget>
      </div>
    </DashboardLayout>
  )
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
