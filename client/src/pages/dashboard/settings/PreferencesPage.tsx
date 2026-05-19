import { useEffect, useState } from 'react'
import { DashboardLayout } from '../../../layouts/DashboardLayout'
import { Widget } from '../../../components/dashboard/Widget'
import { AlertBanner } from '../../../components/common/AlertBanner'
import { Button } from '../../../components/common/Button'
import { AlertCircle, Bell, Globe, Lock } from 'lucide-react'
import { preferencesService } from '../../../services'

interface Preferences {
  emailAlerts?: boolean
  pushNotifications?: boolean
  dailySummary?: boolean
  weeklyReport?: boolean
  criticalOnly?: boolean
  theme?: 'light' | 'dark'
  compactView?: boolean
  language?: string
  timeFormat?: '12h' | '24h'
}

export default function PreferencesPage() {
  const [preferences, setPreferences] = useState<Preferences>({})
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingPrefs, setLoadingPrefs] = useState(true)

  // Load preferences on mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        setLoadingPrefs(true)
        const prefs = await preferencesService.getPreferences()
        if (prefs) {
          setPreferences(prefs)
        }
      } catch (err) {
        console.error('Failed to load preferences:', err)
        setError('Failed to load preferences')
      } finally {
        setLoadingPrefs(false)
      }
    }
    loadPreferences()
  }, [])

  const handleSavePreferences = async () => {
    try {
      setLoading(true)
      setError(null)
      await preferencesService.updatePreferences(preferences)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError('Failed to save preferences')
      console.error('Failed to save preferences:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loadingPrefs) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
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

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
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
                  checked={preferences.emailAlerts || false}
                  onChange={(e) =>
                    setPreferences({ ...preferences, emailAlerts: e.target.checked })
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
                  checked={preferences.pushNotifications || false}
                  onChange={(e) =>
                    setPreferences({ ...preferences, pushNotifications: e.target.checked })
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
                  checked={preferences.dailySummary || false}
                  onChange={(e) =>
                    setPreferences({ ...preferences, dailySummary: e.target.checked })
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
                  checked={preferences.weeklyReport || false}
                  onChange={(e) =>
                    setPreferences({ ...preferences, weeklyReport: e.target.checked })
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
                  checked={preferences.criticalOnly || false}
                  onChange={(e) =>
                    setPreferences({ ...preferences, criticalOnly: e.target.checked })
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
                    checked={preferences.theme === 'light' || preferences.theme === undefined}
                    onChange={(e) =>
                      setPreferences({ ...preferences, theme: e.target.value as 'light' })
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
                    checked={preferences.theme === 'dark'}
                    onChange={(e) =>
                      setPreferences({ ...preferences, theme: e.target.value as 'dark' })
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
                value={preferences.language || 'en'}
                onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
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
                    checked={preferences.timeFormat === '12h' || preferences.timeFormat === undefined}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
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
                    checked={preferences.timeFormat === '24h'}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
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
                  checked={preferences.compactView || false}
                  onChange={(e) =>
                    setPreferences({ ...preferences, compactView: e.target.checked })
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
          <Button onClick={handleSavePreferences} loading={loading}>
            Save Preferences
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )

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
