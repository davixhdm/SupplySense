import { useState, useEffect } from 'react'
import { DashboardLayout } from '../../../layouts/DashboardLayout'
import { Widget } from '../../../components/dashboard/Widget'
import { Button } from '../../../components/common/Button'
import { AlertBanner } from '../../../components/common/AlertBanner'
import { AlertCircle, Smartphone, Trash2, Shield } from 'lucide-react'
import { deviceService } from '../../../services'
import { useApiPaginated, useApiMutation } from '../../../hooks'

interface Device {
  id?: string
  _id?: string
  name: string
  type?: string
  os?: string
  lastActive?: string
  status?: 'active' | 'inactive'
  ipAddress?: string
}

export default function DevicesPage() {
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch devices
  const {
    data: devices,
    loading,
    error: devicesError,
    refetch,
  } = useApiPaginated(deviceService.getDevices, 1, 50)

  // Mutation for deactivating device
  const { mutate: deactivateDevice } = useApiMutation(
    (id) => deviceService.deactivateDevice(id)
  )

  const handleRemoveDevice = async (deviceId: string) => {
    if (window.confirm('Are you sure you want to deactivate this device?')) {
      try {
        setError(null)
        await deactivateDevice(deviceId)
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
        refetch()
      } catch (err) {
        setError('Failed to deactivate device')
        console.error('Failed to deactivate device:', err)
      }
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Devices</h1>
          <p className="text-gray-600 mt-1">View and manage devices accessing your account</p>
        </div>

        {saved && (
          <AlertBanner type="success" message="Device settings updated successfully" />
        )}

        {(error || devicesError) && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error || devicesError}</p>
          </div>
        )}

        {/* Devices List */}
        <Widget title="Active Devices" icon={<Smartphone className="w-5 h-5" />}>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : devices.length > 0 ? (
            <div className="space-y-3">
              {devices.map((device) => (
                <div
                  key={device._id || device.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">{device.name}</p>
                      <p className="text-sm text-gray-600">
                        {device.type} • {device.os} • {device.ipAddress}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Last active: {device.lastActive || 'Unknown'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        device.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {device.status || 'active'}
                    </span>
                    <button
                      onClick={() => handleRemoveDevice(device._id || device.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 py-8 text-center">No devices found</p>
          )}
        </Widget>

        {/* Security Info */}
        <Widget title="Device Security" icon={<Shield className="w-5 h-5" />}>
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                These are all devices that have accessed your account. If you see any unfamiliar devices, 
                you can deactivate them immediately to protect your account.
              </p>
            </div>
          </div>
        </Widget>
      </div>
    </DashboardLayout>
  )
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </Widget>

        {/* Active Devices */}
        <Widget title="Your Devices" icon={<Smartphone className="w-5 h-5" />}>
          <div className="space-y-3">
            {devices.map((device) => (
              <div
                key={device.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">{device.name}</p>
                      <p className="text-sm text-gray-600">
                        {device.type} • {device.os} • {device.ipAddress}
                      </p>
                      <p className="text-xs text-gray-500">Last active: {device.lastActive}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      device.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {device.status}
                  </span>
                  {device.status === 'active' && (
                    <button
                      onClick={() => handleLogoutDevice(device.id)}
                      className="text-orange-600 hover:text-orange-800 text-sm font-medium"
                    >
                      Logout
                    </button>
                  )}
                  <button
                    onClick={() => handleRemoveDevice(device.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Widget>

        {/* Security Info */}
        <Widget title="Security" icon={<Shield className="w-5 h-5" />}>
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong>Tip:</strong> Review your active devices regularly. Remove any devices you no longer recognize or use.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="font-medium text-gray-900">Active Devices</p>
                <p className="text-2xl font-bold text-blue-600 mt-2">
                  {devices.filter((d) => d.status === 'active').length}
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="font-medium text-gray-900">Total Devices</p>
                <p className="text-2xl font-bold text-gray-600 mt-2">{devices.length}</p>
              </div>
            </div>
          </div>
        </Widget>
      </div>
    </DashboardLayout>
  )
}
