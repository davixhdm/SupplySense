import { useState } from 'react'
import { DashboardLayout } from '../../../layouts/DashboardLayout'
import { Widget } from '../../../components/dashboard/Widget'
import { AlertBanner } from '../../../components/common/AlertBanner'
import { Bell, Moon, Globe, Lock } from 'lucide-react'

interface NotificationPreferences {
  emailAlerts: boolean
  pushNotifications: boolean
  dailySummary: boolean
  weeklyReport: boolean
  criticalOnly: boolean
}

interface DisplayPreferences {
  theme: 'light' | 'dark'
  compactView: boolean
  language: string
  timeFormat: '12h' | '24h'
}

export default function PreferencesPage() {
  const [notifPrefs, setNotifPrefs] = useState<NotificationPreferences>({
    emailAlerts: true,
    pushNotifications: true,
    dailySummary: true,
    weeklyReport: false,
    criticalOnly: false,
  })

  const [displayPrefs, setDisplayPrefs] = useState<DisplayPreferences>({
    theme: 'light',
    compactView: false,
    language: 'en',
    timeFormat: '12h',
  })

  const [saved, setSaved] = useState(false)

  const handleSavePreferences = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Failed to save preferences:', error)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Preferences</h1>
          <p className="text-gray-600 mt-1">Customize your SupplySense experience</p>
        </div>

        {saved && (
          <AlertBanner type="success" message="Preferences saved successfully" />
        )}

        {/* Notification Preferences */}
        <Widget title="Notifications" icon={<Bell className="w-5 h-5" />}>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Email Alerts</p>
                <p className="text-sm text-gray-600">Receive email notifications for important events</p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifPrefs.emailAlerts}
                  onChange={(e) =>
                    setNotifPrefs({ ...notifPrefs, emailAlerts: e.target.checked })
                  }
                  className="w-5 h-5 text-blue-600 rounded"
                />
              </label>
            </div>

            <div className="border-t pt-6 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Push Notifications</p>
                <p className="text-sm text-gray-600">Receive push notifications on your devices</p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifPrefs.pushNotifications}
                  onChange={(e) =>
                    setNotifPrefs({ ...notifPrefs, pushNotifications: e.target.checked })
                  }
                  className="w-5 h-5 text-blue-600 rounded"
                />
              </label>
            </div>

            <div className="border-t pt-6 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Daily Summary</p>
                <p className="text-sm text-gray-600">Get a daily summary of your business metrics</p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifPrefs.dailySummary}
                  onChange={(e) =>
                    setNotifPrefs({ ...notifPrefs, dailySummary: e.target.checked })
                  }
                  className="w-5 h-5 text-blue-600 rounded"
                />
              </label>
            </div>

            <div className="border-t pt-6 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Weekly Report</p>
                <p className="text-sm text-gray-600">Get comprehensive weekly performance reports</p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifPrefs.weeklyReport}
                  onChange={(e) =>
                    setNotifPrefs({ ...notifPrefs, weeklyReport: e.target.checked })
                  }
                  className="w-5 h-5 text-blue-600 rounded"
                />
              </label>
            </div>

            <div className="border-t pt-6 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Critical Alerts Only</p>
                <p className="text-sm text-gray-600">Only receive notifications for critical issues</p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifPrefs.criticalOnly}
                  onChange={(e) =>
                    setNotifPrefs({ ...notifPrefs, criticalOnly: e.target.checked })
                  }
                  className="w-5 h-5 text-blue-600 rounded"
                />
              </label>
            </div>
          </div>
        </Widget>

        {/* Display Preferences */}
        <Widget title="Display & Language" icon={<Globe className="w-5 h-5" />}>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Theme</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="theme"
                    value="light"
                    checked={displayPrefs.theme === 'light'}
                    onChange={(e) =>
                      setDisplayPrefs({ ...displayPrefs, theme: e.target.value as 'light' })
                    }
                    className="w-4 h-4 text-blue-600 mr-2"
                  />
                  <span className="text-gray-700">Light</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="theme"
                    value="dark"
                    checked={displayPrefs.theme === 'dark'}
                    onChange={(e) =>
                      setDisplayPrefs({ ...displayPrefs, theme: e.target.value as 'dark' })
                    }
                    className="w-4 h-4 text-blue-600 mr-2"
                  />
                  <span className="text-gray-700">Dark</span>
                </label>
              </div>
            </div>

            <div className="border-t pt-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">Language</label>
              <select
                value={displayPrefs.language}
                onChange={(e) => setDisplayPrefs({ ...displayPrefs, language: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="zh">Chinese</option>
                <option value="ja">Japanese</option>
              </select>
            </div>

            <div className="border-t pt-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">Time Format</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="timeFormat"
                    value="12h"
                    checked={displayPrefs.timeFormat === '12h'}
                    onChange={(e) =>
                      setDisplayPrefs({
                        ...displayPrefs,
                        timeFormat: e.target.value as '12h',
                      })
                    }
                    className="w-4 h-4 text-blue-600 mr-2"
                  />
                  <span className="text-gray-700">12-hour (2:30 PM)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="timeFormat"
                    value="24h"
                    checked={displayPrefs.timeFormat === '24h'}
                    onChange={(e) =>
                      setDisplayPrefs({
                        ...displayPrefs,
                        timeFormat: e.target.value as '24h',
                      })
                    }
                    className="w-4 h-4 text-blue-600 mr-2"
                  />
                  <span className="text-gray-700">24-hour (14:30)</span>
                </label>
              </div>
            </div>

            <div className="border-t pt-6 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Compact View</p>
                <p className="text-sm text-gray-600">Use compact layout for tables and lists</p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={displayPrefs.compactView}
                  onChange={(e) =>
                    setDisplayPrefs({ ...displayPrefs, compactView: e.target.checked })
                  }
                  className="w-5 h-5 text-blue-600 rounded"
                />
              </label>
            </div>
          </div>
        </Widget>

        {/* Privacy & Security */}
        <Widget title="Privacy & Security" icon={<Lock className="w-5 h-5" />}>
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                Your privacy is important to us. For more information about how we handle your data,
                please review our{' '}
                <a href="#" className="font-medium text-blue-600 hover:text-blue-800">
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </div>
        </Widget>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSavePreferences}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}
