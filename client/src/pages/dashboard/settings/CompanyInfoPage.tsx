import { useEffect, useState } from 'react'
import { DashboardLayout } from '../../../layouts/DashboardLayout'
import { Widget } from '../../../components/dashboard/Widget'
import { Input } from '../../../components/common/Input'
import { Button } from '../../../components/common/Button'
import { AlertBanner } from '../../../components/common/AlertBanner'
import { AlertCircle } from 'lucide-react'
import { companySettingsService } from '../../../services'

interface CompanyInfo {
  name?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  country?: string
  postalCode?: string
  industry?: string
  employeeCount?: string
}

export default function CompanyInfoPage() {
  const [formData, setFormData] = useState<CompanyInfo>({})
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadingSettings, setLoadingSettings] = useState(true)

  // Load company settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoadingSettings(true)
        const settings = await companySettingsService.getCompanySettings()
        if (settings) {
          setFormData(settings)
        }
      } catch (err) {
        console.error('Failed to load settings:', err)
        setError('Failed to load company settings')
      } finally {
        setLoadingSettings(false)
      }
    }
    loadSettings()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSaved(false)
    setError(null)

    try {
      await companySettingsService.updateCompanySettings(formData)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError('Failed to save company information')
      console.error('Failed to save:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loadingSettings) {
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
          <h1 className="text-3xl font-bold text-gray-900">Company Information</h1>
          <p className="text-gray-600 mt-1">Manage your company details</p>
        </div>

        {saved && (
          <AlertBanner type="success" message="Company information updated successfully" />
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Company Info Form */}
        <Widget title="Basic Information">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Company Name"
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Input
                label="Email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <Input
                label="Phone"
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <select
                value={formData.industry || ''}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
              >
                <option value="">Select Industry</option>
                <option>Retail & Distribution</option>
                <option>Manufacturing</option>
                <option>Wholesale</option>
                <option>E-Commerce</option>
                <option>Other</option>
              </select>
              <Input
                label="Address"
                type="text"
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
              <Input
                label="City"
                type="text"
                value={formData.city || ''}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
              <Input
                label="Country"
                type="text"
                value={formData.country || ''}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              />
              <Input
                label="Postal Code"
                type="text"
                value={formData.postalCode || ''}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
              />
              <select
                value={formData.employeeCount || ''}
                onChange={(e) => setFormData({ ...formData, employeeCount: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
              >
                <option value="">Select Size</option>
                <option>1-10</option>
                <option>10-50</option>
                <option>50-100</option>
                <option>100-500</option>
                <option>500+</option>
              </select>
            </div>

            <Button type="submit" loading={loading}>
              Save Changes
            </Button>
          </form>
        </Widget>
      </div>
    </DashboardLayout>
  )
}
