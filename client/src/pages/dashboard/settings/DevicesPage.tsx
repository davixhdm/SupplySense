import { useState } from 'react'
import { DashboardLayout } from '../../../layouts/DashboardLayout'
import { Widget } from '../../../components/dashboard/Widget'
import { Button } from '../../../components/common/Button'
import { Input } from '../../../components/common/Input'
import { AlertBanner } from '../../../components/common/AlertBanner'
import { Smartphone, Trash2, Plus, Shield } from 'lucide-react'

interface Device {
  id: string
  name: string
  type: string
  os: string
  lastActive: string
  status: 'active' | 'inactive'
  ipAddress: string
}

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([
    {
      id: '1',
      name: 'MacBook Pro',
      type: 'Laptop',
      os: 'macOS 14.0',
      lastActive: '5 minutes ago',
      status: 'active',
      ipAddress: '192.168.1.100',
    },
    {
      id: '2',
      name: 'iPhone 14',
      type: 'Mobile',
      os: 'iOS 17.0',
      lastActive: '2 hours ago',
      status: 'inactive',
      ipAddress: '192.168.1.105',
    },
    {
      id: '3',
      name: 'Windows Desktop',
      type: 'Desktop',
      os: 'Windows 11',
      lastActive: '1 day ago',
      status: 'inactive',
      ipAddress: '192.168.1.110',
    },
  ])

  const [showAddDevice, setShowAddDevice] = useState(false)
  const [newDevice, setNewDevice] = useState({ name: '', type: '', os: '' })
  const [saved, setSaved] = useState(false)

  const handleAddDevice = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newDevice.name && newDevice.type && newDevice.os) {
      const device: Device = {
        id: Date.now().toString(),
        name: newDevice.name,
        type: newDevice.type,
        os: newDevice.os,
        lastActive: 'Just now',
        status: 'active',
        ipAddress: '192.168.1.' + Math.floor(Math.random() * 255),
      }
      setDevices([...devices, device])
      setNewDevice({ name: '', type: '', os: '' })
      setShowAddDevice(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  const handleRemoveDevice = (deviceId: string) => {
    setDevices(devices.filter((d) => d.id !== deviceId))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleLogoutDevice = (deviceId: string) => {
    setDevices(
      devices.map((d) =>
        d.id === deviceId ? { ...d, status: 'inactive', lastActive: 'just logged out' } : d
      )
    )
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

        {/* Add Device */}
        <Widget title="Add New Device">
          {!showAddDevice ? (
            <Button
              onClick={() => setShowAddDevice(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Device
            </Button>
          ) : (
            <form onSubmit={handleAddDevice} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Device Name"
                  type="text"
                  placeholder="e.g., My iPhone"
                  value={newDevice.name}
                  onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                />
                <select
                  value={newDevice.type}
                  onChange={(e) => setNewDevice({ ...newDevice, type: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                >
                  <option value="">Select Type</option>
                  <option value="Laptop">Laptop</option>
                  <option value="Desktop">Desktop</option>
                  <option value="Mobile">Mobile</option>
                  <option value="Tablet">Tablet</option>
                </select>
                <Input
                  label="Operating System"
                  type="text"
                  placeholder="e.g., iOS 17.0"
                  value={newDevice.os}
                  onChange={(e) => setNewDevice({ ...newDevice, os: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Add Device
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddDevice(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-900 px-4 py-2 rounded-lg"
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
